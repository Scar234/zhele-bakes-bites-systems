import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MapPin, Phone, User, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const deliveryFee = deliveryType === 'delivery' ? (cartTotal >= 1500 ? 0 : 100) : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Your cart is empty! Add treats to continue.');
      navigate('/shop');
      return;
    }

    if (!customerName.trim() || !phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryLocation.trim()) {
      alert('Please enter your delivery address or hostel name.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      deliveryType,
      deliveryLocation: deliveryType === 'delivery' ? deliveryLocation.trim() : 'On-Shop Pickup',
      orderNotes: orderNotes.trim() || undefined,
      paymentMethod,
      items: cartItems.map((item) => ({
        product: item.productId,
        name: item.name,
        variantName: item.variantName || null,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await ordersApi.createOrder(payload);

      if (response && response.success && response.data) {
        const orderData = response.data;
        clearCart();
        // Redirect to order confirmation page with state
        navigate(`/order-confirmation/${orderData.orderNumber || orderData._id}`, {
          state: { order: orderData, paymentMethod },
        });
      } else {
        throw new Error(response.message || 'Failed to submit order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setSubmitError(err.message || 'Unable to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF4ED] text-3xl flex items-center justify-center mx-auto">
          🛒
        </div>
        <h2 className="text-2xl font-black text-[#4B2E2B]">Your Cart is Empty</h2>
        <p className="text-xs text-[#776D68]">
          Add delicious bakery treats to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#4B2E2B] text-white text-xs font-bold rounded-full hover:bg-[#2D150F] transition-all shadow-md"
        >
          Browse Bakery Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EEDCCB] pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4B2E2B] hover:text-[#C8874A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-black text-[#4B2E2B] font-display">
          Checkout
        </h1>
        <div className="w-10"></div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold text-center">
          ⚠️ {submitError}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Delivery & Payment Details */}
        <div className="md:col-span-7 space-y-6">
          
          {/* 1. Fulfillment Option */}
          <div className="bg-white rounded-3xl p-5 border border-[#EEDCCB] shadow-xs space-y-3">
            <span className="text-[11px] font-extrabold text-[#C8874A] uppercase tracking-wider block">
              Step 1: Fulfillment Type
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  deliveryType === 'delivery'
                    ? 'border-[#C8874A] bg-[#FFF8F0] text-[#4B2E2B] ring-2 ring-[#C8874A]/20'
                    : 'border-[#EEDCCB] bg-white text-[#776D68] hover:bg-[#FAF4ED]'
                }`}
              >
                <span className="text-xl">🛵</span>
                <span className="font-extrabold">Campus / Local Delivery</span>
                <span className="text-[10px] text-[#C8874A]">
                  {cartTotal >= 1500 ? 'FREE' : '+ KSh 100'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  deliveryType === 'pickup'
                    ? 'border-[#C8874A] bg-[#FFF8F0] text-[#4B2E2B] ring-2 ring-[#C8874A]/20'
                    : 'border-[#EEDCCB] bg-white text-[#776D68] hover:bg-[#FAF4ED]'
                }`}
              >
                <span className="text-xl">🏬</span>
                <span className="font-extrabold">On-Shop Pickup</span>
                <span className="text-[10px] text-green-600">FREE</span>
              </button>
            </div>
          </div>

          {/* 2. Customer & Delivery Address (Matching Mockup) */}
          <div className="bg-white rounded-3xl p-5 border border-[#EEDCCB] shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-[#776D68] uppercase tracking-wider">
                {deliveryType === 'delivery' ? 'Delivery Address' : 'Customer Details'}
              </span>
              <button
                type="button"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-xs font-bold text-[#C8874A] hover:underline"
              >
                {isEditingAddress ? 'Done Editing' : 'Change'}
              </button>
            </div>

            {(!isEditingAddress && customerName && phone) ? (
              <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#EEDCCB] text-xs space-y-1 text-[#4B2E2B]">
                <div className="flex items-center gap-2 font-black text-sm">
                  <User className="w-3.5 h-3.5 text-[#C8874A]" />
                  <span>{customerName}</span>
                </div>
                {deliveryType === 'delivery' && (
                  <div className="flex items-center gap-2 text-[#776D68]">
                    <MapPin className="w-3.5 h-3.5 text-[#C8874A]" />
                    <span>{deliveryLocation || 'No address entered'}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#776D68]">
                  <Phone className="w-3.5 h-3.5 text-[#C8874A]" />
                  <span>{phone}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-[#4B2E2B] block mb-1">
                    Customer Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Gabriel Amani"
                    className="w-full p-2.5 bg-[#FAF4ED] text-xs font-semibold rounded-xl border border-[#EEDCCB] focus:outline-none focus:border-[#C8874A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4B2E2B] block mb-1">
                    M-Pesa / Contact Phone:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0712345678"
                    className="w-full p-2.5 bg-[#FAF4ED] text-xs font-semibold rounded-xl border border-[#EEDCCB] focus:outline-none focus:border-[#C8874A]"
                  />
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <label className="text-xs font-bold text-[#4B2E2B] block mb-1">
                      Delivery Address / Campus Hostel:
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="e.g. Daystar Main Campus, Hostel B or Westlands, Mpaka Lane"
                      className="w-full p-2.5 bg-[#FAF4ED] text-xs font-semibold rounded-xl border border-[#EEDCCB] focus:outline-none focus:border-[#C8874A]"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-[#4B2E2B] block mb-1">
                    Email Address (Optional):
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gabriel@example.com"
                    className="w-full p-2.5 bg-[#FAF4ED] text-xs font-semibold rounded-xl border border-[#EEDCCB] focus:outline-none focus:border-[#C8874A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4B2E2B] block mb-1">
                    Special Instructions / Note (Optional):
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Please include extra serviettes / birthday candle"
                    className="w-full p-2.5 bg-[#FAF4ED] text-xs font-semibold rounded-xl border border-[#EEDCCB] focus:outline-none focus:border-[#C8874A]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment Method (Exact Mockup Layout) */}
          <div className="bg-white rounded-3xl p-5 border border-[#EEDCCB] shadow-xs space-y-3">
            <span className="text-[11px] font-extrabold text-[#776D68] uppercase tracking-wider block">
              Payment Method
            </span>

            <div className="space-y-2.5">
              {/* Option 1: M-Pesa */}
              <label
                aria-disabled="true"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EEDCCB] bg-gray-50 opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={false}
                    disabled
                    readOnly
                    className="accent-[#00A859]"
                  />
                  <div className="flex items-center gap-2 font-bold text-xs text-[#4B2E2B]">
                    <Smartphone className="w-4 h-4 text-[#00A859]" />
                    <span>M-Pesa (coming soon)</span>
                  </div>
                </div>
                <span className="bg-gray-200 text-gray-600 text-[10px] font-black px-2.5 py-0.5 rounded">
                  NOT ACTIVE
                </span>
              </label>

              {/* Option 2: Card Payment */}
              <label
                aria-disabled="true"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EEDCCB] bg-gray-50 opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={false}
                    disabled
                    readOnly
                    className="accent-[#C8874A]"
                  />
                  <div className="flex items-center gap-2 font-bold text-xs text-[#4B2E2B]">
                    <CreditCard className="w-4 h-4 text-[#C8874A]" />
                    <span>Card Payment (coming soon)</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-500">
                  NOT ACTIVE
                </span>
              </label>

              {/* Option 3: Cash on Delivery / Pickup */}
              <label
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-[#4B2E2B] bg-[#FFF8F0] ring-2 ring-[#4B2E2B]/20'
                    : 'border-[#EEDCCB] bg-white hover:bg-[#FAF4ED]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="accent-[#4B2E2B]"
                  />
                  <div className="flex items-center gap-2 font-bold text-xs text-[#4B2E2B]">
                    <DollarSign className="w-4 h-4 text-[#4B2E2B]" />
                    <span>Cash on Delivery</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-500">
                  💵 Pay in Person
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-[#EEDCCB] shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#4B2E2B] font-display border-b border-[#EEDCCB] pb-3">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Items list */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {cartItems.map((item) => (
                <div key={item.key} className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-extrabold text-[#C8874A]">
                      {item.quantity}x
                    </span>
                    <span className="truncate text-[#4B2E2B] font-medium">
                      {item.name} {item.variantName ? `(${item.variantName})` : ''}
                    </span>
                  </div>
                  <span className="font-bold text-[#4B2E2B] shrink-0">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-[#EEDCCB] pt-3 space-y-2 text-xs text-[#292321]">
              <div className="flex justify-between">
                <span className="text-[#776D68]">Subtotal</span>
                <span className="font-bold">KSh {cartTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#776D68]">Delivery Fee</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `KSh ${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between font-black text-base text-[#4B2E2B] border-t border-gray-100 pt-2">
                <span>Total</span>
                <span className="text-[#C8874A]">KSh {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Orders are currently placed with payment due in person. */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#4B2E2B] hover:bg-[#2D150F] text-white font-black text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2" 
            >
              <span>✓</span>
              <span>{isSubmitting ? 'Placing Order...' : `Place Order · KSh ${grandTotal.toLocaleString()}`}</span>
            </button>

            <p className="text-[11px] text-[#776D68] text-center font-medium leading-relaxed bg-[#FAF4ED] p-2.5 rounded-xl border border-[#EEDCCB]">
              Payment is due in person at pickup or delivery. M-Pesa and card payments will be enabled after payment integration is configured.
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#776D68] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A859]" />
              <span>Order details are validated by the bakery server</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
