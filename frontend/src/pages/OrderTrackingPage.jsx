import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, Clock, ChefHat, CheckCircle, PackageCheck, AlertTriangle } from 'lucide-react';
import { ordersApi } from '../services/api';
import { io } from 'socket.io-client';

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const [searchCode, setSearchCode] = useState(initialCode);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialCode));
  const [error, setError] = useState(null);

  const fetchOrder = async (codeToSearch, showLoading = false) => {
    if (!codeToSearch.trim()) return;
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const res = await ordersApi.getOrderById(codeToSearch.trim().toUpperCase());
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError(`No order found with code "${codeToSearch}".`);
      }
    } catch (err) {
      console.error('Track error:', err);
      setError(`Order "${codeToSearch}" not found. Please double-check your code (e.g. ZHL-A1B2C3D4E5F60708).`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchOrder(initialCode, false);
    }
  }, [initialCode]);

  // Real-time live status updates via Socket.io
  useEffect(() => {
    if (!order?.orderNumber) return undefined;
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.emit('track:subscribe', { orderNumber: order.orderNumber });
    socket.on('order:updated', (updated) => {
      if (updated.orderNumber === order.orderNumber) setOrder(updated);
    });
    return () => socket.disconnect();
  }, [order?.orderNumber]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchCode.trim()) {
      setSearchParams({ code: searchCode.trim().toUpperCase() });
      fetchOrder(searchCode.trim());
    }
  };

  const steps = [
    { key: 'pending', label: 'Received', icon: Clock, desc: 'Ticket sent to kitchen' },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, desc: 'Bakers preparing station' },
    { key: 'preparing', label: 'Baking & Packing', icon: ChefHat, desc: 'Treats fresh in the oven' },
    { key: 'ready', label: 'Ready', icon: PackageCheck, desc: 'Ready for pickup / rider' },
    { key: 'completed', label: 'Completed', icon: CheckCircle, desc: 'Enjoy your fresh treats!' },
  ];

  const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    const idx = steps.findIndex((s) => s.key === status);
    return idx > -1 ? idx : 0;
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-[#776D68]">
        <Link to="/" className="hover:text-[#4B2E2B] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#C8874A]" />
        <span className="text-[#4B2E2B] font-bold">Track Your Order</span>
      </nav>

      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C8874A] block">
          Real-Time Kitchen Feed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#4B2E2B] font-display">
          Track Your Bakery Order
        </h1>
        <p className="text-xs sm:text-sm text-[#776D68] max-w-md mx-auto">
          Enter the order code from your checkout receipt (e.g., <strong className="text-[#C8874A]">ZHL-A1B2C3D4E5F60708</strong>) to follow your bakes in real time.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-3 rounded-2xl border border-[#EEDCCB] shadow-sm flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            placeholder="Enter Order Code (e.g. ZHL-A1B2C3D4E5F60708)"
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl bg-[#FAF4ED] border border-[#EEDCCB] focus:outline-none focus:border-[#C8874A]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#4B2E2B] hover:bg-[#2D150F] text-white font-extrabold text-xs rounded-xl transition-all shadow-md shrink-0"
        >
          {loading ? 'Locating...' : 'Track'}
        </button>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEDCCB] shadow-lg space-y-8 animate-in fade-in duration-300">
          
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEDCCB] pb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#776D68] tracking-widest block">
                Active Order
              </span>
              <h2 className="text-2xl font-black text-[#4B2E2B] font-display">
                {order.orderNumber}
              </h2>
              <p className="text-xs text-[#776D68] mt-0.5">
                Ordered by: <strong className="text-[#4B2E2B]">{order.customerName}</strong> ({order.phone})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-extrabold uppercase text-[#776D68] block">
                Current Kitchen Status
              </span>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mt-1 ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                ● {order.status}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {order.status === 'cancelled' ? (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 mx-auto text-red-500" />
              <h3 className="font-extrabold text-base">This Order Has Been Cancelled</h3>
              <p className="text-xs">Please contact bakery support at +254 712 345 678 for assistance.</p>
            </div>
          ) : (
            <div className="py-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const Icon = st.icon;

                  return (
                    <div
                      key={st.key}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                        isCurrent
                          ? 'bg-[#FFF8F0] border-[#C8874A] ring-2 ring-[#C8874A]/30 shadow-sm'
                          : isDone
                          ? 'bg-green-50/60 border-green-200 text-green-900'
                          : 'bg-[#FAF4ED]/50 border-gray-100 text-gray-400 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                          isDone
                            ? 'bg-[#00A859] text-white shadow-xs'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-xs text-[#4B2E2B]">
                        {st.label}
                      </span>
                      <span className="text-[10px] text-[#776D68] mt-0.5 leading-tight">
                        {st.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fulfillment & Items Summary */}
          <div className="bg-[#FAF4ED] p-5 rounded-2xl border border-[#EEDCCB] space-y-3 text-xs">
            <div className="flex justify-between items-center font-bold text-[#4B2E2B] border-b border-[#EEDCCB]/60 pb-2">
              <span>Fulfillment: {order.deliveryType === 'delivery' ? 'Campus/Local Delivery' : 'Pickup at Shop'}</span>
              <span className="text-[#776D68] font-normal">{order.deliveryLocation}</span>
            </div>

            <div className="space-y-1.5">
              {order.items?.map((it, i) => (
                <div key={i} className="flex justify-between text-[#4B2E2B]">
                  <span>
                    {it.quantity}x {it.name} {it.variantName ? `(${it.variantName})` : ''}
                  </span>
                  <span className="font-bold">
                    KSh {(it.price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-black text-sm text-[#4B2E2B] border-t border-[#EEDCCB]/60 pt-2">
              <span>Total Amount</span>
              <span className="text-[#C8874A]">
                KSh {order.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/shop"
              className="text-xs font-bold text-[#4B2E2B] hover:text-[#C8874A] transition-colors"
            >
              &larr; Return to Bakery Menu
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
