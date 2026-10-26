import { Sparkles, Phone, Clock } from 'lucide-react';
import { BUSINESS_PHONE } from '../../config/business';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" className="bg-[#4B2E2B] text-[#FFF8F0] text-xs font-semibold py-2 px-4 border-b border-[#2D150F]/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C8874A] animate-pulse" />
          <span>
            Fresh batches baked daily at <strong className="text-[#F4D7C4]">7:00 AM &amp; 2:00 PM</strong> • Free campus delivery on orders above KSh 1,500!
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-[11px] text-[#F4D7C4]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#C8874A]" />
            <span>Open: Mon-Sat 7am - 9pm</span>
          </div>
          {BUSINESS_PHONE && (
            <a href={`tel:${BUSINESS_PHONE}`} className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-[#C8874A]" />
              <span>{BUSINESS_PHONE}</span>
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
