import { useCart } from '../../context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <aside aria-label="Notifications" className="fixed top-24 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3 bg-[#4B2E2B] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#C8874A]/40 ring-4 ring-[#C8874A]/10">
        <CheckCircle2 className="w-5 h-5 text-[#00A859] shrink-0" />
        <span className="text-xs sm:text-sm font-bold tracking-wide">
          {toastMessage}
        </span>
      </div>
    </aside>
  );
}
