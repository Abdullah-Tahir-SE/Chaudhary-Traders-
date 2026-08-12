import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SalesStats from '../../components/admin/SalesStats';
import { ShoppingCart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b">
          <div>
            <h1 className="text-2xl font-extrabold text-[#2A1B69]">Management Dashboard</h1>
            <p className="text-xs text-slate-500">Real-time Sahiwal Store Overview, Daily Revenue & Inventory Alerts</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/pos"
              className="px-4 py-2.5 rounded-xl bg-[#00A651] text-white font-extrabold text-xs flex items-center gap-2 hover:bg-[#008440] shadow-md transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Launch POS Billing</span>
            </Link>

            <Link
              to="/admin/inventory"
              className="px-4 py-2.5 rounded-xl bg-[#2A1B69] text-white font-extrabold text-xs flex items-center gap-2 hover:bg-[#1C114C] transition-all"
            >
              <Package className="w-4 h-4" />
              <span>Manage Stock</span>
            </Link>
          </div>
        </div>

        <SalesStats />
      </main>
    </div>
  );
}
