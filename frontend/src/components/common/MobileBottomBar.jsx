import { NavLink } from 'react-router-dom';
import { Home, Utensils, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function MobileBottomBar() {
  const { cartCount, openCart } = useCart();

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-t border-[#EEDCCB] px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-[#C8874A]' : 'text-[#776D68] hover:text-[#4B2E2B]'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        {/* Menu */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-[#C8874A]' : 'text-[#776D68] hover:text-[#4B2E2B]'
            }`
          }
        >
          <Utensils className="w-5 h-5" />
          <span>Menu</span>
        </NavLink>

        {/* Cart Trigger */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-1 text-[10px] font-bold text-[#776D68] hover:text-[#4B2E2B] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C8874A] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#FFF8F0]">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* Track Orders */}
        <NavLink
          to="/track"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-[#C8874A]' : 'text-[#776D68] hover:text-[#4B2E2B]'
            }`
          }
        >
          <Package className="w-5 h-5" />
          <span>Orders</span>
        </NavLink>

        {/* Admin / Portal */}
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-[#C8874A]' : 'text-[#776D68] hover:text-[#4B2E2B]'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Staff</span>
        </NavLink>

      </div>
    </nav>
  );
}
