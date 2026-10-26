import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Shield, Clock, Compass } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import AnnouncementBar from './AnnouncementBar';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Track Order', path: '/track' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#EEDCCB] shadow-xs">
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. Official Brand Logo */}
          <Link
            to="/"
            className="flex items-center group transition-transform duration-200 active:scale-95"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
              src="/logo.png"
              alt="Zhele Bakes n Bites — Fresh bites Everyday"
              className="h-12 sm:h-15 w-auto object-contain drop-shadow-xs hover:brightness-105 transition-all"
            />
          </Link>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#4B2E2B] text-white shadow-xs'
                      : 'text-[#4B2E2B] hover:text-[#C8874A] hover:bg-[#F4D7C4]/30'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* 3. Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-full text-[#4B2E2B] hover:text-[#C8874A] hover:bg-[#F4D7C4]/30 transition-colors"
              title="Search menu"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Portal Shortcut */}
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#4B2E2B] bg-[#F4D7C4]/40 hover:bg-[#F4D7C4] transition-colors border border-[#EEDCCB]"
              title="Kitchen & Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-[#C8874A]" />
              <span>Kitchen Portal</span>
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center p-2.5 rounded-full bg-[#4B2E2B] text-white hover:bg-[#2D150F] active:scale-95 transition-all shadow-sm"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C8874A] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-[#FFF8F0] shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-[#4B2E2B] hover:bg-[#F4D7C4]/30 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {isSearchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="pb-4 pt-1 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cakes, pastries, cookies, beef samosas, juices..."
                autoFocus
                className="w-full pl-11 pr-24 py-3 bg-white text-sm font-semibold rounded-2xl border-2 border-[#C8874A] shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8874A]/30 text-[#292321]"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 bg-[#C8874A] text-white text-xs font-bold rounded-xl hover:bg-[#b57438] transition-colors shadow-xs"
              >
                Search
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#EEDCCB] bg-[#FFF8F0] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bakery menu..."
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-white rounded-xl border border-[#EEDCCB]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </form>

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-[#4B2E2B] text-white shadow-xs'
                    : 'text-[#4B2E2B] hover:bg-[#F4D7C4]/40'
                }`
              }
            >
              <span>{link.name}</span>
              <Compass className="w-4 h-4 opacity-50" />
            </NavLink>
          ))}

          <div className="pt-4 border-t border-[#EEDCCB] space-y-2">
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-[#4B2E2B] bg-[#F4D7C4]/50 hover:bg-[#F4D7C4]"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C8874A]" />
                <span>Kitchen &amp; Admin Dashboard</span>
              </div>
              <span className="text-[10px] uppercase font-black text-[#C8874A]">Manage</span>
            </Link>

            <div className="flex items-center gap-2 px-4 py-2 text-[11px] text-[#776D68]">
              <Clock className="w-3.5 h-3.5 text-[#C8874A]" />
              <span>Mon-Sat: 7:00 AM – 9:00 PM • Daystar &amp; Athi River</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
