import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MascotIllustration from '../components/common/MascotIllustration';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. Hero Brand Narrative */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C8874A] block">
          Our Baking Story
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#4B2E2B] font-display">
          Fresh Bites Everyday, Crafted With Warmth &amp; Heart
        </h1>
        <p className="text-sm sm:text-base text-[#776D68] leading-relaxed">
          Founded in Kenya, Zhele Bakes &amp; Bites was born from a simple passion: to bring genuine warmth, hygienic standards, and irresistible fresh aroma to daily bakes, campus snacks, and family celebrations.
        </p>
      </section>

      {/* 2. Visual Story Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-12 border border-[#EEDCCB] shadow-sm">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C8874A]">
            Rooted in Community
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#4B2E2B] font-display">
            From Early Morning Flour to Smiles on Your Table
          </h2>
          <p className="text-xs sm:text-sm text-[#776D68] leading-relaxed">
            Every day at 5:00 AM, our bakehouse starts stirring with the comforting aromas of cardamon-infused mandazi, pure butter croissants, golden artisan sandwich loaves, and rich molten chocolate cakes.
          </p>
          <p className="text-xs sm:text-sm text-[#776D68] leading-relaxed">
            Serving students at Daystar University, workers across Athi River, and families throughout Nairobi, we take pride in honest portions, clean kitchen environments, and reliable delivery right to your hostel or doorstep.
          </p>

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4B2E2B] text-white text-xs font-extrabold rounded-full hover:bg-[#2D150F] transition-all shadow-md"
            >
              <span>Explore Our Bakes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 flex justify-center">
          <div className="w-64 h-64 sm:w-80 sm:h-80">
            <MascotIllustration className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-[#4B2E2B] font-display">
            What Guides Every Recipe
          </h2>
          <p className="text-xs text-[#776D68] mt-1">
            Our unbending commitment to quality you can see, smell, and savor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF4ED] p-6 rounded-3xl border border-[#EEDCCB] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EEDCCB] flex items-center justify-center text-xl shadow-xs">
              🌾
            </div>
            <h3 className="font-extrabold text-base text-[#4B2E2B]">Wholesome Ingredients</h3>
            <p className="text-xs text-[#776D68] leading-relaxed">
              We choose unadulterated dairy butter, premium cocoa, pure spices, and farm fresh eggs. No preservatives, artificial stabilizers, or stale pre-mixes.
            </p>
          </div>

          <div className="bg-[#FAF4ED] p-6 rounded-3xl border border-[#EEDCCB] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EEDCCB] flex items-center justify-center text-xl shadow-xs">
              🧼
            </div>
            <h3 className="font-extrabold text-base text-[#4B2E2B]">Strict Food Hygiene</h3>
            <p className="text-xs text-[#776D68] leading-relaxed">
              Our kitchen adheres to the highest cleanliness standards. Every batch is prepared with sanitized utensils, food-grade gloves, and neat hygienic packaging.
            </p>
          </div>

          <div className="bg-[#FAF4ED] p-6 rounded-3xl border border-[#EEDCCB] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EEDCCB] flex items-center justify-center text-xl shadow-xs">
              ❤️
            </div>
            <h3 className="font-extrabold text-base text-[#4B2E2B]">Honest Accessibility</h3>
            <p className="text-xs text-[#776D68] leading-relaxed">
              Great baking should be enjoyed by all. We keep prices fair for campus students and local residents without compromising on rich flavour.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Kitchen Hours & Location Banner */}
      <section className="bg-[#4B2E2B] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#C8874A]/30 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C8874A]">
            Visit Us or Order Delivery
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
            Craving Something Fresh Right Now?
          </h3>
          <p className="text-xs sm:text-sm text-[#F4D7C4]/80 max-w-lg">
            Our ovens are firing throughout the day. Place your order online for campus delivery or stop by our bakehouse counter.
          </p>
        </div>

        <div className="flex gap-4 shrink-0">
          <Link
            to="/shop"
            className="px-6 py-3.5 bg-[#C8874A] hover:bg-[#b57438] text-white font-extrabold text-xs rounded-full shadow-lg transition-all"
          >
            Order Treats Now
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-full border border-white/20 transition-all"
          >
            Contact Bakers
          </Link>
        </div>
      </section>

    </div>
  );
}
