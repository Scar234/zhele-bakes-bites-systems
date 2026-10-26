import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowUpDown, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import ProductCard from '../components/shop/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { catalogApi } from '../services/api';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');

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
        console.error('Error fetching shop catalogue:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load bakery catalogue');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync URL search params when category or search changes
  useEffect(() => {
    const params = {};
    if (selectedCategory && selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, setSearchParams]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all') {
          const catSlug = product.category?.slug?.toLowerCase() || '';
          const catName = product.category?.name?.toLowerCase() || '';
          const target = selectedCategory.toLowerCase();
          if (catSlug !== target && !catName.includes(target)) {
            return false;
          }
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name?.toLowerCase().includes(q);
          const matchDesc = product.description?.toLowerCase().includes(q);
          const matchCat = product.category?.name?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.hasVariants && a.variants?.[0]?.price ? a.variants[0].price : a.basePrice;
        const priceB = b.hasVariants && b.variants?.[0]?.price ? b.variants[0].price : b.basePrice;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0; // Default order
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-[#776D68]">
        <Link to="/" className="hover:text-[#4B2E2B] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#C8874A]" />
        <span className="text-[#4B2E2B] font-bold">Our Menu</span>
      </nav>

      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EEDCCB] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8874A] block mb-1">
            Fresh From The Oven
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#4B2E2B] font-display">
            Our Bakery Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#776D68] mt-1 max-w-xl">
            Browse our full selection of freshly prepared celebration cakes, pastries, crunchy cookies, ring donuts, hot savoury bites, and chilled fruit juices.
          </p>
        </div>

        {/* Counter */}
        <div className="text-xs font-bold text-[#4B2E2B] bg-[#FAF4ED] px-4 py-2 rounded-2xl border border-[#EEDCCB] self-start md:self-auto shrink-0">
          Showing <span className="text-[#C8874A]">{filteredProducts.length}</span> items
        </div>
      </div>

      {/* Search Bar & Filter Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cakes, pastries, samosas, donuts..."
            className="w-full pl-11 pr-4 py-3 bg-white text-xs sm:text-sm font-semibold rounded-2xl border border-[#EEDCCB] shadow-xs focus:outline-none focus:border-[#C8874A] focus:ring-2 focus:ring-[#C8874A]/20 text-[#292321]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-gray-400 hover:text-[#4B2E2B] font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-[#C8874A]" />
          <span className="text-xs font-bold text-[#4B2E2B]">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2.5 text-xs font-bold rounded-xl border border-[#EEDCCB] bg-white text-[#4B2E2B] focus:outline-none focus:border-[#C8874A]"
          >
            <option value="featured">Featured / Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills (Matching Mockup screen "Our Menu") */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#4B2E2B] text-white shadow-md'
              : 'bg-white text-[#4B2E2B] border border-[#EEDCCB] hover:bg-[#FAF4ED]'
          }`}
        >
          All Treats
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
          return (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#4B2E2B] text-white shadow-md'
                  : 'bg-white text-[#4B2E2B] border border-[#EEDCCB] hover:bg-[#FAF4ED]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Failed to connect to bakery API</h4>
              <p className="text-xs">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EEDCCB] p-8 space-y-4">
          <div className="w-16 h-16 bg-[#FAF4ED] text-3xl rounded-full flex items-center justify-center mx-auto">
            🔍
          </div>
          <h3 className="font-black text-lg text-[#4B2E2B]">No Bakery Treats Found</h3>
          <p className="text-xs text-[#776D68] max-w-sm mx-auto">
            We couldn't find any items matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another keyword or browse all treats.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-6 py-2.5 bg-[#4B2E2B] text-white text-xs font-bold rounded-full hover:bg-[#2D150F] transition-all shadow-md"
          >
            Show All Menu Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod, idx) => {
            const ratings = [4.9, 4.7, 4.8, 4.6, 4.7, 4.6, 5.0];
            const reviews = [128, 95, 86, 112, 120, 78, 64];
            return (
              <ProductCard
                key={prod._id}
                product={prod}
                rating={ratings[idx % ratings.length]}
                reviews={reviews[idx % reviews.length]}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
