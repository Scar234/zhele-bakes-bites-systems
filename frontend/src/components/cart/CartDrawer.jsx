import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const estimatedDelivery = cartTotal > 0 ? (cartTotal >= 1500 ? 0 : 100) : 0;
  const grandTotal = cartTotal + estimatedDelivery;

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <aside aria-label="Shopping Cart" className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Background click to dismiss */}
      <div className="flex-1" onClick={closeCart} />

      {/* Drawer Panel */}
      <div className="w-full max-w-md bg-[#FFF8F0] h-full shadow-2xl flex flex-col justify-between p-6 overflow-hidden border-l border-[#EEDCCB] animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="flex justify-between items-center border-b border-[#EEDCCB] pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C8874A]" />
            <h2 className="text-xl font-extrabold text-[#4B2E2B] font-display">
              Your Cart ({cartItems.length})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-gray-400 hover:text-[#4B2E2B] hover:bg-[#F4D7C4]/40 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Free Delivery Progress */}
        {cartItems.length > 0 && (
          <div className="bg-[#FAF4ED] p-3 rounded-2xl border border-[#EEDCCB] my-3">
            <div className="flex justify-between text-xs font-bold text-[#4B2E2B] mb-1.5">
              <span>
                {cartTotal >= 1500
                  ? '🎉 Free Campus & Local Delivery unlocked!'
                  : `Add KSh ${(1500 - cartTotal).toLocaleString()} more for FREE delivery`}
              </span>
              <span>{Math.min(100, Math.round((cartTotal / 1500) * 100))}%</span>
            </div>
            <div className="w-full bg-[#EEDCCB] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C8874A] h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (cartTotal / 1500) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#FAF4ED] border-2 border-dashed border-[#C8874A]/40 flex items-center justify-center text-3xl">
                🧁
              </div>
              <div>
                <h3 className="font-extrabold text-[#4B2E2B] text-base">Your cart is empty</h3>
                <p className="text-xs text-[#776D68] mt-1 max-w-xs">
                  Discover our freshly baked cakes, flaky pastries, cookies, and savoury bites!
                </p>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="px-6 py-2.5 bg-[#4B2E2B] text-white text-xs font-bold rounded-full hover:bg-[#2D150F] transition-all shadow-md"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#EEDCCB] shadow-xs gap-3"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[#EEDCCB] shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-[#4B2E2B] text-xs sm:text-sm truncate">
                    {item.name}
                  </h4>
                  {item.variantName && (
                    <span className="text-[10px] font-bold text-[#776D68] block">
                      Size: {item.variantName}
                    </span>
                  )}
                  <span className="text-xs font-black text-[#C8874A]">
                    KSh {item.price.toLocaleString()}
                  </span>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-[#FAF4ED] border border-[#EEDCCB] rounded-full p-1">
                    <button
                      onClick={() => updateQuantity(item.key, -1)}
                      className="w-6 h-6 rounded-full bg-white text-[#4B2E2B] hover:bg-[#F4D7C4] flex items-center justify-center text-xs font-bold transition-colors shadow-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black text-[#4B2E2B] w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.key, 1)}
                      className="w-6 h-6 rounded-full bg-white text-[#4B2E2B] hover:bg-[#F4D7C4] flex items-center justify-center text-xs font-bold transition-colors shadow-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Breakdown & Action */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#EEDCCB] pt-4 space-y-3 bg-[#FFF8F0]">
            <div className="bg-white p-3.5 rounded-2xl border border-[#EEDCCB] space-y-2 text-xs text-[#292321]">
              <div className="flex justify-between">
                <span className="text-[#776D68]">Subtotal</span>
                <span className="font-bold">KSh {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#776D68]">Delivery Fee</span>
                <span className="font-bold">
                  {estimatedDelivery === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `KSh ${estimatedDelivery}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#4B2E2B] border-t border-gray-100 pt-2">
                <span>Total Amount</span>
                <span className="text-[#C8874A]">KSh {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-4 bg-[#4B2E2B] hover:bg-[#2D150F] text-white font-extrabold text-sm rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
