import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductQuickModal from './ProductQuickModal';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Derived display price
  const displayPrice = product.hasVariants && product.variants?.length > 0
    ? product.variants[0].price
    : product.basePrice;

  const handleCardAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.hasVariants && product.variants?.length > 0) {
      setIsModalOpen(true);
    } else {
      addToCart(product, null, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#EEDCCB] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group bakery-card">
        
        {/* Clickable Image & Category */}
        <Link to={`/product/${product._id}`} className="block relative overflow-hidden rounded-2xl mb-3">
          <div className="aspect-square w-full overflow-hidden bg-[#FAF4ED] relative">
            <img
              src={
                product.imageUrl ||
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop'
              }
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />

            {/* Category / Variant Pill */}
            {product.hasVariants && (
              <span className="absolute top-2.5 left-2.5 bg-[#4B2E2B]/85 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                Options
              </span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="mb-1.5">
              <span className="inline-flex rounded-full bg-[#FAF4ED] px-2 py-1 text-[10px] font-bold text-[#776D68]">
                {product.isAvailable === false ? 'Currently unavailable' : 'Available to order'}
              </span>
            </div>

            {/* Product Title */}
            <Link to={`/product/${product._id}`} className="block">
              <h3 className="font-extrabold text-sm sm:text-base text-[#4B2E2B] group-hover:text-[#C8874A] transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Brief snippet */}
            <p className="text-[11px] text-[#776D68] line-clamp-1 mt-0.5">
              {product.description || 'Freshly baked daily with love & care'}
            </p>
          </div>

          {/* Price & Action */}
          <div className="mt-3 pt-3 border-t border-[#EEDCCB]/60 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-semibold text-[#776D68] block leading-none">Price</span>
              <span className="text-xs sm:text-sm font-black text-[#4B2E2B]">
                KSh {displayPrice?.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCardAdd}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                justAdded
                  ? 'bg-[#00A859] text-white'
                  : 'bg-[#4B2E2B] hover:bg-[#2D150F] text-white active:scale-95 shadow-sm'
              }`}
              title="Add to shopping cart"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Select Modal for Variants */}
      {isModalOpen && (
        <ProductQuickModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
