import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Menu, X, User, UserPlus, UserCheck } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import CustomerRegisterModal from '../auth/CustomerRegisterModal';
import CustomerProfileModal from '../auth/CustomerProfileModal';

const productCategories = [
  { label: 'Fertilizers (Khad & DAP)', path: '/products?category=fertilizers' },
  { label: 'Crop Sprays & Pesticides', path: '/products?category=pesticides' },
  { label: 'Hybrid Seeds', path: '/products?category=seeds' },
  { label: 'Micronutrients & Foliar', path: '/products?category=micronutrients' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 font-sans">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200 p-1 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden shrink-0">
              <img src={logoImg} alt="Chaudhary Traders Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="block font-extrabold text-base sm:text-xl leading-tight text-[#2A1B69] font-display whitespace-nowrap">
                Chaudhary <span className="text-[#00A651]">Traders</span>
              </span>
              <span className="hidden sm:block text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Agri-Care & Plant Protection
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
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
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative hidden xl:block">
              <input
                type="text"
                placeholder="Search khad, spray..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 focus:w-48 transition-all duration-300 bg-[#F8FAFC] text-slate-800 text-xs rounded-full pl-9 pr-3 py-2 border border-slate-200 outline-none focus:border-[#00A651]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </form>

            {/* USER BUTTON (Account / Sign Up) */}
            {isAuthenticated ? (
              <button
                onClick={() => setProfileModalOpen(true)}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-50 text-[#00A651] hover:bg-emerald-100 text-[11px] sm:text-xs font-extrabold border border-emerald-200 flex items-center gap-1 sm:gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="max-w-[85px] sm:max-w-none truncate">Account ({user?.name || 'Farmer'})</span>
              </button>
            ) : (
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#00A651] text-white hover:bg-[#008440] text-[11px] sm:text-xs font-extrabold flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">Sign Up</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Button (ALWAYS VISIBLE & UNCLIPPED ON RIGHT) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation Drawer"
              className="lg:hidden p-1.5 sm:p-2 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center justify-center shrink-0"
            >
              {mobileOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
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

            <div className="flex flex-col space-y-2 text-sm font-bold">
              <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50">
                Home Page
              </Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50">
                Products Store
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="px-4 py-3 rounded-xl bg-emerald-50 text-[#00A651] flex items-center justify-between text-left font-bold"
                >
                  <span>My Profile Account ({user?.name})</span>
                  <UserCheck className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setRegisterModalOpen(true);
                  }}
                  className="px-4 py-3 rounded-xl bg-[#00A651] text-white flex items-center justify-between text-left font-bold"
                >
                  <span>Sign Up / Register Account</span>
                  <UserPlus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modals */}
      <CustomerRegisterModal isOpen={registerModalOpen} onClose={() => setRegisterModalOpen(false)} />
      <CustomerProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
}
