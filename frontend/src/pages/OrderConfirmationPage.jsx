import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, MapPin, Phone } from 'lucide-react';
import { ordersApi } from '../services/api';
import { io } from 'socket.io-client';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  const initialOrder = location.state?.order || null;

  useEffect(() => {
    if (initialOrder || !id) return undefined;
    let cancelled = false;
    ordersApi
      .getOrderById(id)
      .then((res) => {
        if (cancelled) return;
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load order:', err);
        setError(err.message || 'Could not find order confirmation');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, initialOrder]);

  useEffect(() => {
    if (!order?.orderNumber) return undefined;
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.emit('track:subscribe', { orderNumber: order.orderNumber });
    socket.on('order:updated', (updated) => {
      if (updated.orderNumber === order.orderNumber) setOrder(updated);
    });
    return () => socket.disconnect();
  }, [order?.orderNumber]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#00A859] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-[#776D68]">Verifying order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-[#C8874A] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ?
        </div>
        <h2 className="text-2xl font-black text-[#4B2E2B]">Order Confirmation</h2>
        <p className="text-xs text-[#776D68]">{error || 'Unable to locate order reference.'}</p>
        <Link
          to="/track"
          className="inline-block px-6 py-3 bg-[#4B2E2B] text-white text-xs font-bold rounded-full"
        >
          Go to Order Tracker
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-green-100 text-[#00A859] flex items-center justify-center mx-auto shadow-inner text-4xl">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
        <h1 className="text-3xl font-black text-[#4B2E2B] font-display">
          Order Placed Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-[#776D68] max-w-md mx-auto">
          Thank you for choosing Zhele Bakes &amp; Bites! Our bakers have received your ticket and are preparing your treats with care.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEDCCB] shadow-md space-y-6">
        
        {/* Order Reference Box */}
        <div className="bg-[#FAF4ED] p-4 rounded-2xl border border-[#EEDCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[#776D68] tracking-widest block">
              Order Reference Code
            </span>
            <span className="text-2xl font-black text-[#C8874A] tracking-wider font-display">
              {order.orderNumber}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black self-center sm:self-auto capitalize">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>Status: {order.status}</span>
          </div>
        </div>

        {/* Customer & Fulfillment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#292321] border-b border-[#EEDCCB] pb-6">
          <div className="space-y-1">
            <span className="text-[#776D68] font-bold block uppercase text-[10px]">
              Customer Details
            </span>
            <p className="font-extrabold text-[#4B2E2B]">{order.customerName}</p>
            {order.phone && (
              <div className="flex items-center gap-1.5 text-[#776D68]">
                <Phone className="w-3.5 h-3.5 text-[#C8874A]" />
                <span>{order.phone}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[#776D68] font-bold block uppercase text-[10px]">
              Fulfillment Method
            </span>
            <p className="font-extrabold text-[#4B2E2B] capitalize">
              {order.deliveryType === 'delivery' ? 'Campus / Local Delivery' : 'On-Shop Pickup'}
            </p>
            <div className="flex items-center gap-1.5 text-[#776D68]">
              <MapPin className="w-3.5 h-3.5 text-[#C8874A]" />
              <span>{order.deliveryLocation}</span>
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase text-[#776D68] tracking-wider">
            Items in This Order
          </h3>

          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#C8874A]">{item.quantity}x</span>
                  <span className="font-bold text-[#4B2E2B]">
                    {item.name} {item.variantName ? `(${item.variantName})` : ''}
                  </span>
                </div>
                <span className="font-bold text-[#4B2E2B]">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm font-black text-[#4B2E2B] pt-3">
            <span>Total Confirmed</span>
            <span className="text-lg text-[#C8874A]">
              KSh {order.totalAmount?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment status — payment provider integration is not enabled yet. */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-extrabold">Payment status: {order.paymentStatus || 'pending'}</p>
          <p className="text-[11px] leading-relaxed">
            {order.paymentMethod === 'cash'
              ? 'Payment is due in person at pickup or delivery. Our staff will confirm when it has been received.'
              : 'Online payment is not enabled yet. Please contact the bakery to arrange payment; this order confirmation does not mean a payment has been completed.'}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to={`/track?code=${order.orderNumber}`}
            className="flex-1 py-3.5 bg-[#4B2E2B] hover:bg-[#2D150F] text-white font-extrabold text-xs rounded-full shadow-md text-center flex items-center justify-center gap-2 transition-all"
          >
            <span>Live Order Progress Tracker</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/shop"
            className="py-3.5 px-6 bg-[#FAF4ED] text-[#4B2E2B] hover:bg-[#F4D7C4] font-extrabold text-xs rounded-full border border-[#EEDCCB] text-center transition-colors"
          >
            Order More Treats
          </Link>
        </div>

      </div>

    </div>
  );
}
