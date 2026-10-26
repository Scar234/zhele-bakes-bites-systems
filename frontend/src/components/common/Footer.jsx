import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';
import { BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_WHATSAPP } from '../../config/business';

export default function Footer() {
  return (
    <footer className="bg-[#2D150F] text-[#FFF8F0] pt-16 pb-10 border-t-4 border-[#C8874A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Brand Story & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#FFF8F0] p-1 shadow-md border-2 border-[#C8874A] flex items-center justify-center overflow-hidden shrink-0">
                <img src="/mascot.png" alt="Zhele Baker Mascot" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white font-display block leading-none">
                  Zhele Bakes &amp; Bites
                </span>
                <span className="text-xs font-bold text-[#C8874A] tracking-wider uppercase">
                  ~ Fresh Bites Everyday ~
                </span>
              </div>
            </div>

            <p className="text-sm text-[#F4D7C4]/80 leading-relaxed max-w-sm">
              Handcrafting artisan bread, custom birthday cakes, flaky pastries, and delectable bites with love, pure ingredients, and hygienic care every morning in Kenya.
            </p>

            <p className="text-xs text-[#F4D7C4]/70">
              Follow our menu for fresh bakery updates. Newsletter signups will be available soon.
            </p>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-white/10 pb-2">
              Explore Menu
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F4D7C4]/80 font-medium">
              <li>
                <Link to="/shop?category=cakes" className="hover:text-white transition-colors">
                  Celebration Cakes &amp; Slices
                </Link>
              </li>
              <li>
                <Link to="/shop?category=pastries" className="hover:text-white transition-colors">
                  Cinnamon Rolls &amp; Croissants
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cookies" className="hover:text-white transition-colors">
                  Choc-Chip Cookies
                </Link>
              </li>
              <li>
                <Link to="/shop?category=donuts" className="hover:text-white transition-colors">
                  Glazed &amp; Filled Donuts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=snacks" className="hover:text-white transition-colors">
                  Beef Samosas &amp; Fries
                </Link>
              </li>
              <li>
                <Link to="/shop?category=combos" className="hover:text-white transition-colors">
                  Daily Specials &amp; Combos
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Help & Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-white/10 pb-2">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F4D7C4]/80 font-medium">
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Baking Mission
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Custom Orders
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Kitchen Portal (Staff)
                </Link>
              </li>
              {BUSINESS_WHATSAPP && (
                <li>
                  <a href={`https://wa.me/${BUSINESS_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5 text-green-400 font-bold">
                    <span>WhatsApp Live Order</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Col 5: Contact Info & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-white/10 pb-2">
              Bakehouse Location
            </h4>
            
            <div className="flex items-start gap-2.5 text-xs text-[#F4D7C4]/80">
              <MapPin className="w-4 h-4 text-[#C8874A] shrink-0 mt-0.5" />
              <span>Daystar Main Campus, Athi River &amp; Nairobi, Kenya</span>
            </div>

            {BUSINESS_PHONE && (
              <div className="flex items-center gap-2.5 text-xs text-[#F4D7C4]/80">
                <Phone className="w-4 h-4 text-[#C8874A] shrink-0" />
                <a href={`tel:${BUSINESS_PHONE}`} className="hover:text-white transition-colors">{BUSINESS_PHONE}</a>
              </div>
            )}

            {BUSINESS_EMAIL && (
              <div className="flex items-center gap-2.5 text-xs text-[#F4D7C4]/80">
                <Mail className="w-4 h-4 text-[#C8874A] shrink-0" />
                <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-white transition-colors">{BUSINESS_EMAIL}</a>
              </div>
            )}

            <div className="flex items-start gap-2.5 text-xs text-[#F4D7C4]/80 pt-1">
              <Clock className="w-4 h-4 text-[#C8874A] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Mon – Sat: 7:00 AM – 9:00 PM</p>
                <p>Sunday: 8:00 AM – 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F4D7C4]/60">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} Zhele Bakes &amp; Bites. Made with{' '}
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" /> in Kenya.
          </p>

          <p className="text-[11px] text-white/70">Current payment option: pay in person at pickup or delivery. Online payments are coming soon.</p>
        </div>
      </div>
    </footer>
  );
}
