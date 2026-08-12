import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Menu, X, Phone, MessageSquare } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const productCategories = [
  { label: 'Fertilizers (Khad & DAP)', path: '/products?category=fertilizers' },
  { label: 'Crop Sprays & Pesticides', path: '/products?category=pesticides' },
  { label: 'Hybrid Seeds', path: '/products?category=seeds' },
  { label: 'Micronutrients & Foliar', path: '/products?category=micronutrients' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="Chaudhary Traders Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="block font-extrabold text-xl leading-tight text-[#2A1B69] font-display">
              Chaudhary <span className="text-[#00A651]">Traders</span>
            </span>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              Agri-Care & Plant Protection
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menu (Single Line, Professional Spacing) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'text-[#00A651] bg-emerald-50'
                  : 'text-slate-700 hover:text-[#00A651] hover:bg-slate-50'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'text-[#00A651] bg-emerald-50'
                  : 'text-slate-700 hover:text-[#00A651] hover:bg-slate-50'
              }`
            }
          >
            About Us
          </NavLink>

          {/* Products Dropdown */}
          <div className="relative group">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'text-[#00A651] bg-emerald-50'
                    : 'text-slate-700 hover:text-[#00A651] hover:bg-slate-50'
                }`
              }
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-slate-500" />
            </NavLink>

            <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2">
                {productCategories.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#F8FAFC] hover:text-[#00A651] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'text-[#00A651] bg-emerald-50'
                  : 'text-slate-700 hover:text-[#00A651] hover:bg-slate-50'
              }`
            }
          >
            Contact Store
          </NavLink>
        </nav>

        {/* Right Action Section */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search khad, spray..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 focus:w-56 transition-all duration-300 bg-[#F8FAFC] text-slate-800 text-xs rounded-full pl-9 pr-4 py-2 border border-slate-200 outline-none focus:border-[#00A651]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <a
            href="https://wa.me/923414518001?text=Hello%20Chaudhary%20Traders,%20I%20want%20to%20place%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#00A651] text-white text-xs font-extrabold hover:bg-[#008440] transition-all shadow-md shadow-emerald-600/20 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Order WhatsApp</span>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Drawer"
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 animate-fade-in shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search products in store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 outline-none focus:border-[#00A651]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </form>

          <div className="flex flex-col space-y-1 text-sm font-bold">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-slate-800 hover:bg-slate-50 hover:text-[#00A651]"
            >
              Home Page
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-slate-800 hover:bg-slate-50 hover:text-[#00A651]"
            >
              About Us
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-slate-800 hover:bg-slate-50 hover:text-[#00A651]"
            >
              All Products & Fertilizers
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-slate-800 hover:bg-slate-50 hover:text-[#00A651]"
            >
              Contact & Store Location
            </Link>
            <a
              href="tel:+923414518001"
              className="px-4 py-3 rounded-xl text-white bg-[#00A651] flex items-center justify-between"
            >
              <span>Call Helpline: 0341 4518001</span>
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
