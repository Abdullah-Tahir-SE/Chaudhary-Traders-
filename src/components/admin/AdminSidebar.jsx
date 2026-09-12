import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, ArrowLeft, ShieldCheck, LogOut } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-[#2A1B69] text-white border-b border-white/10 sticky top-0 z-40 shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="Chaudhary Traders Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="block font-bold text-sm leading-tight">Chaudhary Traders</span>
            <span className="block text-[9px] text-[#00A651] font-extrabold uppercase tracking-widest">
              POS & Admin Terminal
            </span>
          </div>
        </Link>

        {/* Navigation Items (Pills) */}
        <nav className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl flex-wrap">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                isActive
                  ? 'bg-[#00A651] text-white shadow-sm'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/pos"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                isActive
                  ? 'bg-[#00A651] text-white shadow-sm'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>POS Counter</span>
          </NavLink>

          <NavLink
            to="/admin/inventory"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                isActive
                  ? 'bg-[#00A651] text-white shadow-sm'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
                isActive
                  ? 'bg-[#00A651] text-white shadow-sm'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users Directory</span>
          </NavLink>
        </nav>

        {/* Right Section: Terminal Status, Logged Admin & Logout Link */}
        <div className="flex items-center gap-2">
          <span className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />
            {user ? user.name : 'Admin Active'}
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-500/20 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer"
            title="Sign out of admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/10 text-slate-200 text-xs font-bold hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
