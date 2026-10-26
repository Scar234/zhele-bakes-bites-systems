import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import MascotIllustration from '../components/common/MascotIllustration';
import ProductCard from '../components/shop/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { catalogApi } from '../services/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    Promise.all([catalogApi.getProducts(), catalogApi.getCategories()])
      .then(([prodRes, catRes]) => {
        if (!isMounted) return;
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load home data:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProducts = products.slice(0, 6);
  const comboProduct = products.find(
    (product) => product.category?.slug === 'combos' || product.name?.toLowerCase().includes('combo')
  );
  const activeComboPrices = comboProduct?.variants?.filter((variant) => variant.isActive).map((variant) => variant.price) || [];
  const comboStartingPrice = comboProduct
    ? (comboProduct.hasVariants && activeComboPrices.length
      ? Math.min(...activeComboPrices)
      : comboProduct.basePrice)
    : null;

  // Category fallback image map
  const categoryImages = {
    cakes: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop',
    pastries: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop',
    cookies: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&auto=format&fit=crop',
    donuts: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&auto=format&fit=crop',
    snacks: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop',
    drinks: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop',
    combos: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=300&auto=format&fit=crop',
  };

  const handleOrderSpecialCombo = () => {
    if (comboProduct?._id) {
      navigate(`/product/${comboProduct._id}`);
      return;
    }
    navigate('/shop?category=combos');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-8 sm:pb-16 bg-gradient-to-b from-[#FFF8F0] via-[#FFFCF8] to-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF4ED] border border-[#EEDCCB] text-[#C8874A] text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>~ Fresh, Tasty &amp; Made with Love ~</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] font-display text-[#4B2E2B]">
                Fresh Bites <br />
                <span className="text-[#C8874A]">Everyday</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#776D68] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Come get a taste of quality, tasty and clean food 😋🥐 Warm artisan loaves, custom celebration cakes, and delicious savoury bites baked fresh every single morning.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-[#4B2E2B] hover:bg-[#2D150F] text-white font-extrabold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop"
                  className="px-8 py-4 bg-[#FFFCF8] hover:bg-[#F4D7C4]/40 text-[#4B2E2B] border-2 border-[#4B2E2B] font-extrabold text-sm sm:text-base rounded-full shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Explore Menu
                </Link>
              </div>

              {/* Feature Badges Under CTAs */}
              <div className="pt-6 border-t border-[#EEDCCB]/60 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-xl mb-1">🥖</span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#4B2E2B]">
                    Fresh Ingredients
                  </span>
                  <span className="text-[10px] text-[#776D68]">Always Premium</span>
                </div>

                <div className="flex flex-col items-center border-x border-[#EEDCCB]">
                  <span className="text-xl mb-1">🧼</span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#4B2E2B]">
                    Hygienically
                  </span>
                  <span className="text-[10px] text-[#776D68]">Prepared Daily</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xl mb-1">🚀</span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#4B2E2B]">
                    Fast &amp; Reliable
                  </span>
                  <span className="text-[10px] text-[#776D68]">Local Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Mascot Illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-72 h-72 sm:w-96 sm:h-96">
                <MascotIllustration className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BANNER (Dark Chocolate Bar from Mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4B2E2B] text-white rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C8874A]/20 border border-[#C8874A]/40 flex items-center justify-center text-xl shrink-0">
              🍞
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Premium Quality</h4>
              <p className="text-xs text-[#F4D7C4]/80 mt-0.5">Best ingredients for best taste</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C8874A]/20 border border-[#C8874A]/40 flex items-center justify-center text-xl shrink-0">
              👨‍🍳
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Made Fresh Daily</h4>
              <p className="text-xs text-[#F4D7C4]/80 mt-0.5">Baked fresh every single day</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C8874A]/20 border border-[#C8874A]/40 flex items-center justify-center text-xl shrink-0">
              🥨
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Variety of Choices</h4>
              <p className="text-xs text-[#F4D7C4]/80 mt-0.5">Wide range of bakes &amp; bites</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C8874A]/20 border border-[#C8874A]/40 flex items-center justify-center text-xl shrink-0">
              🧡
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Made for Sharing</h4>
              <p className="text-xs text-[#F4D7C4]/80 mt-0.5">Hundreds of happy patrons</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4B2E2B] font-display">
              Popular Categories
            </h2>
            <p className="text-xs text-[#776D68] mt-0.5">Explore our daily baked goodness</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#C8874A] hover:text-[#4B2E2B] transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid / Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const img =
              categoryImages[cat.slug] ||
              'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop';
            return (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="bg-white rounded-3xl p-3 border border-[#EEDCCB] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all text-center group bakery-card flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2.5 p-1 bg-[#FAF4ED] border border-[#EEDCCB] group-hover:border-[#C8874A] transition-colors">
                  <img
                    src={img}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="font-extrabold text-xs sm:text-sm text-[#4B2E2B] group-hover:text-[#C8874A] transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#776D68]">
                  {cat.products?.length || 'Fresh'} items
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4B2E2B] font-display">
              Featured Products
            </h2>
            <p className="text-xs text-[#776D68] mt-0.5">Explore bakery favorites and current availability</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/shop"
              className="text-xs font-bold text-[#C8874A] hover:text-[#4B2E2B] transition-colors mr-2"
            >
              View All
            </Link>
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 5. DAILY SPECIALS & COMBO DEAL BANNER (Exact from Mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#4B2E2B] via-[#3a221f] to-[#2D150F] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-[#C8874A]/30">
          
          {/* Ambient pastry doodle pattern */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-9xl">
            🥐
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="md:col-span-5 space-y-3 text-center md:text-left">
              <span className="text-[#C8874A] text-xs font-extrabold uppercase tracking-widest block">
                ⭐ Today’s Highlight
              </span>
              <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
                Daily Specials
              </h3>
              <p className="text-xs sm:text-sm text-[#F4D7C4]/80 max-w-sm">
                Always something delicious for you! Grab our popular afternoon snack combo at unbeatable value.
              </p>
              <button
                onClick={handleOrderSpecialCombo}
                className="mt-3 px-6 py-3 bg-[#C8874A] hover:bg-[#b57438] text-white font-extrabold text-xs rounded-full shadow-lg transition-all"
              >
                Order Special Deal
              </button>
            </div>

            {/* Right Combo Card Showcase */}
            <div className="md:col-span-7 flex justify-center md:justify-end">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-white/20 flex flex-col sm:flex-row items-center gap-5 max-w-md w-full">
                
                {/* Photo with Save Badge */}
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=400&auto=format&fit=crop"
                    alt="Bakery treats and refreshments"
                    className="w-32 h-32 rounded-2xl object-cover shadow-md border-2 border-[#C8874A]"
                  />

                </div>

                {/* Details */}
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold text-[#F4D7C4] tracking-wider">
                    Special Bundle
                  </span>
                  <h4 className="font-extrabold text-base text-white">
                    {comboProduct?.name || 'Explore Bakery Combos'}
                  </h4>
                  <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-1">
                    {comboProduct ? (
                      <span className="text-xl font-black text-[#C8874A]">
                        {comboStartingPrice != null ? `From KSh ${comboStartingPrice.toLocaleString()}` : 'See current prices'}
                      </span>
                    ) : (
                      <span className="text-xs text-white/70">See current combo options and prices</span>
                    )}
                  </div>
                  <button
                    onClick={handleOrderSpecialCombo}
                    className="w-full mt-2 py-2 px-4 bg-white text-[#4B2E2B] hover:bg-[#FAF4ED] font-extrabold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Explore Combos
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE ZHELE BAKES & BITES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C8874A]">
            The Zhele Quality Promise
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#4B2E2B] font-display mt-1">
            Why Our Customers Keep Coming Back
          </h2>
          <p className="text-xs sm:text-sm text-[#776D68] mt-2">
            Every recipe is crafted using genuine ingredients, time-honored baking techniques, and zero shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#EEDCCB] shadow-xs text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#EEDCCB] flex items-center justify-center mx-auto text-2xl shadow-xs">
              🌾
            </div>
            <h3 className="font-black text-lg text-[#4B2E2B]">Authentic &amp; Pure</h3>
            <p className="text-xs text-[#776D68] leading-relaxed">
              We use unbleached wheat flour, farm butter, real Belgian chocolate, and fresh fruit purees with no artificial additives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EEDCCB] shadow-xs text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#EEDCCB] flex items-center justify-center mx-auto text-2xl shadow-xs">
              ⏰
            </div>
            <h3 className="font-black text-lg text-[#4B2E2B]">Warm From The Oven</h3>
            <p className="text-xs text-[#776D68] leading-relaxed">
              Baking begins at 5:00 AM daily. Warm batches of bread, mandazi, and pastries are ready right when you wake up.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EEDCCB] shadow-xs text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#EEDCCB] flex items-center justify-center mx-auto text-2xl shadow-xs">
              🤝
            </div>
            <h3 className="font-black text-lg text-[#4B2E2B]">Campus &amp; Community First</h3>
            <p className="text-xs text-[#776D68] leading-relaxed">
              Direct campus delivery to hostels in Daystar &amp; local Athi River areas with quick M-Pesa convenience.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOM CELEBRATION CAKES TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF4ED] rounded-3xl p-8 sm:p-12 border border-[#EEDCCB] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C8874A]">
              Special Occasions &amp; Birthdays
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#4B2E2B] font-display">
              Need a Custom Birthday or Graduation Cake?
            </h3>
            <p className="text-xs sm:text-sm text-[#776D68] leading-relaxed">
              We specialize in custom flavors, customized edible plaques, photo cakes, and tiered celebration bakes tailored to your vision.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4B2E2B] text-white text-xs font-bold rounded-full hover:bg-[#2D150F] transition-all shadow-md"
              >
                <span>Request Custom Cake Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden shadow-lg border-4 border-white shrink-0">
            <img
              src="https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=500&auto=format&fit=crop"
              alt="Custom Red Velvet Celebration Cake"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER PROMISE — add verified testimonials here when available */}
      <section id="our-promise" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#EEDCCB] bg-white p-8 sm:p-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wide text-[#C8874A]">Our Promise</span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#4B2E2B] font-display">
            Thoughtful Treats, Made for Your Moments
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#776D68]">
            Browse the current menu, choose available sizes and variants, and place an order for pickup or delivery. Verified customer reviews can be added here once the bakery has collected real feedback.
          </p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4B2E2B] px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-[#2D150F]">
            Explore the Menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
