import { useState } from 'react';
import { X, Check, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductQuickModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(() => {
    return product?.variants && product.variants.length > 0 ? product.variants[0] : null;
  });
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;

  const handleAdd = () => {
    addToCart(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFCF8] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EEDCCB] relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#4B2E2B] rounded-full hover:bg-[#F4D7C4]/40 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Header */}
        <div className="flex gap-4 items-center pb-4 border-b border-[#EEDCCB]">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'}
            alt={product.name}
            className="w-20 h-20 rounded-2xl object-cover shadow-xs border border-[#EEDCCB]"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8874A]">
              {product.category?.name || 'Bakery Special'}
            </span>
            <h3 className="font-extrabold text-lg text-[#4B2E2B] leading-tight">
              {product.name}
            </h3>
            <span className="text-base font-black text-[#C8874A] mt-1 block">
              KSh {currentPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#776D68] mt-3 leading-relaxed">
          {product.description || 'Freshly prepared with love and premium ingredients daily.'}
        </p>

        {/* Variants Selector */}
        {product.hasVariants && product.variants && product.variants.length > 0 && (
          <div className="mt-4">
            <label className="text-xs font-bold text-[#4B2E2B] block mb-2">
              Select Size / Option:
            </label>
            <div className="space-y-2">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.name === v.name;
                return (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-[#C8874A] bg-[#FFF8F0] text-[#4B2E2B] ring-2 ring-[#C8874A]/20'
                        : 'border-[#EEDCCB] bg-white text-[#776D68] hover:border-[#C8874A]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-[#C8874A] bg-[#C8874A] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span>{v.name}</span>
                    </div>
                    <span className="font-black text-[#C8874A]">
                      KSh {v.price.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Controls */}
        <div className="mt-5 flex items-center justify-between bg-[#FFF8F0] p-3 rounded-2xl border border-[#EEDCCB]">
          <span className="text-xs font-bold text-[#4B2E2B]">Quantity:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-white border border-[#EEDCCB] text-[#4B2E2B] hover:bg-[#F4D7C4] flex items-center justify-center font-bold transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-black text-sm text-[#4B2E2B] w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-white border border-[#EEDCCB] text-[#4B2E2B] hover:bg-[#F4D7C4] flex items-center justify-center font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAdd}
          className="w-full mt-5 py-3.5 bg-[#4B2E2B] hover:bg-[#2D150F] text-white font-extrabold text-sm rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart • KSh {(currentPrice * quantity).toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}
