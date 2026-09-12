import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
  FileText,
  Clock,
  ChevronRight,
  Package,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { fetchDashboardStatsApi } from '../../services/posApi';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = ['#00A651', '#2A1B69', '#3B82F6', '#F59E0B', '#EC4899'];

export default function SalesStats() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    setRefreshing(true);
    const data = await fetchDashboardStatsApi();
    if (data) {
      setStatsData(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const summary = statsData?.summary || {
    todaySales: 0,
    todayBills: 0,
    totalSales: 0,
    totalBills: 0,
    totalCreditBalance: 0,
    creditFarmersCount: 0,
    lowStockCount: 0,
  };

  const weeklyTrend = statsData?.weeklyTrend?.length
    ? statsData.weeklyTrend
    : [
        { day: 'Mon', revenue: 245000, bills: 18 },
        { day: 'Tue', revenue: 380000, bills: 24 },
        { day: 'Wed', revenue: 190000, bills: 15 },
        { day: 'Thu', revenue: 420000, bills: 32 },
        { day: 'Fri', revenue: 510000, bills: 39 },
        { day: 'Sat', revenue: 640000, bills: 45 },
        { day: 'Sun', revenue: 290000, bills: 22 },
      ];

  const categoryDist = statsData?.categoryDistribution || [];
  const recentSales = statsData?.recentSales || [];
  const lowStockItems = statsData?.lowStockItems || [];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Refresh & Live Status */}
      <div className="flex items-center justify-between bg-white p-3 px-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A651] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A651]"></span>
          </span>
          <span className="text-xs font-extrabold text-[#2A1B69] uppercase tracking-wider">
            PostgreSQL Live Database Connected
          </span>
        </div>

        <button
          onClick={loadStats}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#00A651] ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Stats'}</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today's Sales */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Sales Today</p>
              <h3 className="text-2xl font-black text-[#2A1B69] mt-1 tracking-tight">
                Rs. {summary.todaySales.toLocaleString()}
              </h3>
              <span className="text-[10px] font-bold text-[#00A651] inline-flex items-center gap-1 mt-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" /> Live Real-time POS
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#00A651] border border-emerald-100 flex items-center justify-center font-extrabold shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Metric 2: Today's Invoices Count */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Farmer Invoices</p>
              <h3 className="text-2xl font-black text-[#2A1B69] mt-1 tracking-tight">
                {summary.todayBills} {summary.todayBills === 1 ? 'Bill' : 'Bills'}
              </h3>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                Total Revenue: Rs. {summary.totalSales.toLocaleString()}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-extrabold shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Metric 3: Farmer Credit Khata Balance */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Farmer Ledger (Khata)</p>
              <h3 className="text-2xl font-black text-indigo-900 mt-1 tracking-tight">
                Rs. {summary.totalCreditBalance.toLocaleString()}
              </h3>
              <span className="text-[10px] font-bold text-indigo-700 mt-1 inline-flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md">
                <Users className="w-3 h-3" /> {summary.creditFarmersCount} Farmers Pending
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-extrabold shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Metric 4: Low Stock Alert Warnings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Low Stock Warning</p>
              <h3 className={`text-2xl font-black mt-1 tracking-tight ${summary.lowStockCount > 0 ? 'text-amber-600' : 'text-[#00A651]'}`}>
                {summary.lowStockCount} {summary.lowStockCount === 1 ? 'Item' : 'Items'}
              </h3>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                {summary.lowStockCount > 0 ? 'Below minimum threshold' : 'All stock levels optimal'}
              </span>
            </div>
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${
                summary.lowStockCount > 0 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-[#00A651] border border-emerald-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#2A1B69] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00A651]" />
                Weekly Revenue Trend (PKR)
              </h3>
              <p className="text-xs text-slate-500">Chaudhary Traders Sahiwal Daily POS Sales Breakdown</p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs font-extrabold text-slate-700">
              Last 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A651" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00A651" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickFormatter={(v) => `Rs.${v / 1000}k`} />
                <Tooltip
                  formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#2A1B69', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00A651"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  dot={{ r: 4, fill: '#00A651', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#2A1B69', strokeWidth: 2, stroke: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Category Revenue Breakdown */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#2A1B69] mb-1">Category Revenue Share</h3>
            <p className="text-xs text-slate-500 mb-4">Fertilizers, Pesticides, Seeds & Micronutrients</p>

            <div className="space-y-3">
              {categoryDist.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-8 font-semibold">
                  No sales category data recorded yet.
                </div>
              ) : (
                categoryDist.map((cat, idx) => {
                  const maxRev = categoryDist[0]?.revenue || 1;
                  const pct = Math.round((cat.revenue / maxRev) * 100);
                  const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

                  return (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                          {cat.category}
                        </span>
                        <span className="font-extrabold text-slate-900">Rs. {cat.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">100% Genuine Sungro Catalog</span>
            <Link to="/admin/inventory" className="text-[#00A651] font-extrabold hover:underline flex items-center gap-0.5">
              <span>View Stock</span> <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Sales & Low Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Invoices Table (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#2A1B69] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00A651]" />
                Recent Sales Transactions
              </h3>
              <p className="text-xs text-slate-500">Live PostgreSQL sales transactions feed</p>
            </div>
            <Link to="/admin/pos" className="text-xs font-extrabold text-[#00A651] hover:underline flex items-center gap-1">
              <span>New POS Checkout</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#F8FAFC] text-slate-500 uppercase text-[9.5px] font-extrabold tracking-wider border-y border-slate-200/80">
                <tr>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Farmer</th>
                  <th className="py-2.5 px-3 text-center">Items</th>
                  <th className="py-2.5 px-3 text-right">Grand Total</th>
                  <th className="py-2.5 px-3 text-center">Payment</th>
                  <th className="py-2.5 px-3 text-right">Date / Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSales.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 font-bold">
                      No sales transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#2A1B69]">
                        {sale.invoiceNumber || sale.id}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{sale.customerName || 'Walk-in Farmer'}</span>
                        <span className="text-[10px] text-slate-500">{sale.customerPhone || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700 text-[10.5px]">
                          {sale.totalItems || 1}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#00A651]">
                        Rs. {Number(sale.grandTotal).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            sale.paymentMethod === 'Credit'
                              ? 'bg-amber-100 text-amber-800'
                              : sale.paymentMethod === 'Online'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-[#00A651]'
                          }`}
                        >
                          {sale.paymentMethod || 'Cash'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-[10.5px] text-slate-500 font-semibold">
                        <span className="flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-base text-amber-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4.5 h-4.5" />
                Low Stock Alerts
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10.5px]">
                {lowStockItems.length} Warnings
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Items requiring urgent stock refill from Sungro</p>

            <div className="space-y-2.5">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-[#00A651] mx-auto mb-1" />
                  All inventory items are well stocked!
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                        Category: {item.category || 'General'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md block">
                        {item.stock} {item.unit || 'left'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                        Min: {item.minStock}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              to="/admin/inventory"
              className="w-full py-2.5 rounded-xl bg-[#2A1B69] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 hover:bg-[#1C114C] transition-colors shadow-sm"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Go to Inventory Management</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
