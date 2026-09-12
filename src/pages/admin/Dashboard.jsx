import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SalesStats from '../../components/admin/SalesStats';
import { ShoppingCart, Package, Users, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl mx-auto space-y-6">
        {/* Top Header & Quick Action Buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#00A651] font-extrabold text-[10.5px] tracking-wide uppercase">
                Chaudhary Traders Sahiwal
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Exclusive Sungro Dealer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2A1B69] mt-1 tracking-tight">
              Executive Store Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time PostgreSQL Revenue Analytics, Live POS Feed & Inventory Threshold Warnings
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to="/admin/pos"
              className="px-4 py-2.5 rounded-xl bg-[#00A651] text-white font-extrabold text-xs flex items-center gap-2 hover:bg-[#008440] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>POS Billing Counter</span>
            </Link>

            <Link
              to="/admin/inventory"
              className="px-4 py-2.5 rounded-xl bg-[#2A1B69] text-white font-extrabold text-xs flex items-center gap-2 hover:bg-[#1C114C] transition-all cursor-pointer shadow-sm"
            >
              <Package className="w-4 h-4" />
              <span>Manage Stock SKU</span>
            </Link>
          </div>
        </div>

        {/* Live PostgreSQL Metrics & Analytics */}
        <SalesStats />
      </main>
    </div>
  );
}
