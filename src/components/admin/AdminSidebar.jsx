import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, ArrowLeft, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export default function AdminSidebar() {
  return (
    <header className="w-full bg-[#2A1B69] text-white border-b border-white/10 sticky top-0 z-40 shadow-md">
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
        <nav className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
          <NavLink
            to="/admin"
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
        </nav>

        {/* Right Section: Terminal Status & Storefront Link */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />
            Terminal Active • Sahiwal
          </span>

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
