import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, ShoppingBag, Plus, Minus, Check, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import { catalogApi } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/shop/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    catalogApi
      .getProductById(id)
      .then((res) => {
        if (!isMounted) return;
        const prod = res.data;
        setProduct(prod);
        if (prod.hasVariants && prod.variants?.length > 0) {
          setSelectedVariant(prod.variants[0]);
        } else {
          setSelectedVariant(null);
        }
        setQuantity(1);

        // Fetch related products in the same category
        return catalogApi.getProducts(prod.category?._id || prod.category);
      })
      .then((relRes) => {
        if (!isMounted || !relRes) return;
        const others = (relRes.data || []).filter((p) => p._id !== id).slice(0, 4);
        setRelatedProducts(others);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load product details:', err);
        if (isMounted) {
          setError(err.message || 'Product not found');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#C8874A] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-[#776D68]">Loading fresh bakery treat...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <h2 className="text-2xl font-black text-[#4B2E2B]">Product Not Found</h2>
        <p className="text-xs text-[#776D68]">{error || 'This treat is currently unavailable or has been moved.'}</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4B2E2B] text-white text-xs font-bold rounded-full hover:bg-[#2D150F] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-[#776D68]">
        <Link to="/" className="hover:text-[#4B2E2B] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#C8874A]" />
        <Link to="/shop" className="hover:text-[#4B2E2B] transition-colors">
          Menu
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#C8874A]" />
        <span className="text-[#4B2E2B] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-[#EEDCCB] shadow-sm">
        
        {/* Left: Product Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#FAF4ED] border border-[#EEDCCB] shadow-md relative group">
            <img
              src={
                product.imageUrl ||
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop'
              }
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-[#00A859] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-xs">
              ✓ Fresh Daily
            </div>
          </div>
        </div>

        {/* Right: Product Details & Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8874A]">
                {product.category?.name || 'Bakery Selection'}
              </span>
              <div className="flex items-center gap-1.5 bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#EEDCCB]">
                <Star className="w-4 h-4 fill-[#C8874A] text-[#C8874A]" />
                <span className="text-xs font-black text-[#4B2E2B]">4.9</span>
                <span className="text-[11px] text-[#776D68]">(128 reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-[#4B2E2B] font-display leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#C8874A]">
                KSh {currentPrice?.toLocaleString()}
              </span>
              {selectedVariant && (
                <span className="text-xs font-bold text-[#776D68]">
                  for {selectedVariant.name}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#776D68] leading-relaxed pt-2 border-t border-[#EEDCCB]/60">
              {product.description ||
                'Prepared fresh with pure wheat flour, farm-fresh dairy butter, and authentic gourmet ingredients. Baked right in our kitchen every day.'}
            </p>

            {/* Variant Options Selector */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div className="pt-2">
                <label className="text-xs font-bold text-[#4B2E2B] block mb-2">
                  Choose Variant / Size:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.name === v.name;
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between gap-1 ${
                          isSelected
                            ? 'border-[#C8874A] bg-[#FFF8F0] text-[#4B2E2B] ring-2 ring-[#C8874A]/30'
                            : 'border-[#EEDCCB] bg-white text-[#776D68] hover:border-[#C8874A]'
                        }`}
                      >
                        <span className="font-extrabold">{v.name}</span>
                        <span className="text-[#C8874A] font-black">
                          KSh {v.price.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-2">
              <label className="text-xs font-bold text-[#4B2E2B] block mb-2">
                Quantity:
              </label>
              <div className="inline-flex items-center bg-[#FAF4ED] p-1.5 rounded-full border border-[#EEDCCB]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-white text-[#4B2E2B] hover:bg-[#F4D7C4] flex items-center justify-center font-bold transition-colors shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-sm text-[#4B2E2B] px-5">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-white text-[#4B2E2B] hover:bg-[#F4D7C4] flex items-center justify-center font-bold transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#EEDCCB] space-y-3">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-white font-black text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${
                addedAnimation
                  ? 'bg-[#00A859]'
                  : 'bg-[#4B2E2B] hover:bg-[#2D150F] hover:shadow-xl'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Added {quantity} to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart • KSh {totalPrice.toLocaleString()}</span>
                </>
              )}
            </button>

            {/* Trust highlights */}
            <div className="flex items-center justify-around text-[11px] text-[#776D68] pt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C8874A]" />
                <span>Baked within 4 hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00A859]" />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Related Treats Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-[#4B2E2B] font-display">
              You Might Also Crave
            </h2>
            <Link to="/shop" className="text-xs font-bold text-[#C8874A] hover:underline">
              Browse All Treats &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
