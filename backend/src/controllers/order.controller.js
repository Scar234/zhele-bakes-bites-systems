import { randomBytes } from 'node:crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// ─── Delivery fee rules ───────────────────────────────────────────────────────
const DELIVERY_FEE = 100; // KSh
const FREE_DELIVERY_THRESHOLD = 1500; // KSh

function calcDeliveryFee(deliveryType, subtotal) {
  if (deliveryType === 'pickup') return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sanitizeOrderNumber(raw) {
  return raw?.toUpperCase()?.replace(/[^A-Z0-9\-]/g, '');
}

function toPublicOrder(order) {
  return {
    _id: order._id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    deliveryType: order.deliveryType,
    deliveryLocation: order.deliveryLocation,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    statusHistory: order.statusHistory,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * @desc  Create a new order — prices are recalculated server-side
 * @route POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      deliveryType = 'pickup',
      deliveryLocation,
      orderNotes,
      paymentMethod = 'cash',
      items,
    } = req.body;

    // ── Basic validation ────────────────────────────────────────────────────
    if (!customerName?.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }
    if (!phone?.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }
    if (!['pickup', 'delivery'].includes(deliveryType)) {
      return res.status(400).json({ success: false, message: 'deliveryType must be "pickup" or "delivery".' });
    }
    if (!['mpesa', 'card', 'cash'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Unsupported payment method.' });
    }
    if (deliveryType === 'delivery' && !deliveryLocation?.trim()) {
      return res.status(400).json({ success: false, message: 'Delivery address is required for delivery orders.' });
    }

    // ── Server-side price recalculation ─────────────────────────────────────
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!item.product) {
        return res.status(400).json({ success: false, message: 'Each item must reference a product ID.' });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
        return res.status(400).json({ success: false, message: `Quantity must be between 1 and 50 for item: ${item.name || item.product}` });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (!product.isAvailable) {
        return res.status(400).json({ success: false, message: `"${product.name}" is currently unavailable.` });
      }

      let unitPrice = product.basePrice;
      let variantName = null;

      if (product.hasVariants) {
        const variant = product.variants?.find(
          (v) => v.name === item.variantName && v.isActive
        );
        if (!variant) {
          return res.status(400).json({
            success: false,
            message: `Choose an available variant for "${product.name}".`,
          });
        }
        unitPrice = variant.price;
        variantName = variant.name;
      }

      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        variantName,
        price: unitPrice,
        quantity: item.quantity,
      });
    }

    const deliveryFee = calcDeliveryFee(deliveryType, subtotal);
    const totalAmount = subtotal + deliveryFee;

    // ── Generate unique order number ─────────────────────────────────────────
    const orderNumber = `ZHL-${randomBytes(8).toString('hex').toUpperCase()}`;

    // ── Persist order ────────────────────────────────────────────────────────
    const order = await Order.create({
      orderNumber,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      deliveryType,
      deliveryLocation: deliveryType === 'delivery' ? deliveryLocation.trim() : 'On-Shop Pickup',
      orderNotes: orderNotes?.trim() || '',
      paymentMethod,
      items: validatedItems,
      subtotal,
      deliveryFee,
      totalAmount,
      statusHistory: [{ status: 'pending', note: 'Order placed by customer' }],
    });

    // ── Real-time notification via Socket.io ─────────────────────────────────
    const io = req.app.get('io');
    if (io) io.to('admins').emit('order:created', order.toObject());

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error) {
    console.error('[createOrder]', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
};

/**
 * @desc  Get all orders — admin only (protected in router)
 * @route GET /api/orders  (requires adminAuth middleware)
 */
export const getOrders = async (req, res) => {
  try {
    const { status, page = '1', limit = '50' } = req.query;
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 50));
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status filter.' });
    }
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const total = await Order.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNumber,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc  Get a single order by MongoDB ID or order number — public (tracking)
 * @route GET /api/orders/:identifier
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const safe = sanitizeOrderNumber(id);
    if (!safe || !/^ZHL-[A-F0-9]{16}$/.test(safe)) {
      return res.status(400).json({ success: false, message: 'Enter a valid order reference.' });
    }
    const order = await Order.findOne({ orderNumber: safe });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found. Check the order number and try again.' });
    }

    // Public tracking exposes only the fields needed to follow an order.
    const publicOrder = toPublicOrder(order);

    return res.status(200).json({ success: true, data: publicOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc  Update order status — admin only (protected in router)
 * @route PATCH /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
        $push: {
          statusHistory: {
            status,
            note: note || `Status updated to ${status}`,
            changedAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('order:updated', order.toObject());
      io.to(`order:${order._id}`).emit('order:updated', toPublicOrder(order));
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};