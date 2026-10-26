import { MessageCircle } from 'lucide-react';
import { BUSINESS_WHATSAPP } from '../../config/business';

export default function WhatsAppButton() {
  if (!BUSINESS_WHATSAPP) return null;

  const defaultMessage = encodeURIComponent(
    'Hello Zhele Bakes & Bites! I would like to inquire about bakery orders and daily specials.'
  );
  const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${defaultMessage}`;

  return (
    <aside aria-label="Customer Support" className="fixed bottom-6 right-6 z-30 flex items-center group">
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 bg-[#4B2E2B] text-white text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Chat with Baker on WhatsApp
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#00A859] hover:bg-[#008f4c] text-white flex items-center justify-center shadow-2xl shadow-green-700/40 hover:scale-110 active:scale-95 transition-all duration-200 ring-4 ring-white"
      >
        <MessageCircle className="w-7 h-7 fill-white text-transparent" />
      </a>
    </aside>
  );
}
