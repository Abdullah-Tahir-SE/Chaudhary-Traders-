import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, PackageCheck, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const salesData = [
  { day: 'Mon', revenue: 245000, orders: 18 },
  { day: 'Tue', revenue: 380000, orders: 24 },
  { day: 'Wed', revenue: 190000, orders: 15 },
  { day: 'Thu', revenue: 420000, orders: 32 },
  { day: 'Fri', revenue: 510000, orders: 39 },
  { day: 'Sat', revenue: 640000, orders: 45 },
  { day: 'Sun', revenue: 290000, orders: 22 },
];

export default function SalesStats() {
  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Sales Today</p>
            <h3 className="text-2xl font-extrabold text-[#2A1B69] mt-1">Rs. 640,000</h3>
            <span className="text-[10px] text-[#00A651] font-bold inline-flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> +14.2% from yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00A651] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fertilizer Bags Sold</p>
            <h3 className="text-2xl font-extrabold text-[#2A1B69] mt-1">185 Bags</h3>
            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">DAP & Urea Sona</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Farmer Invoices</p>
            <h3 className="text-2xl font-extrabold text-[#2A1B69] mt-1">45 Bills</h3>
            <span className="text-[10px] text-[#00A651] font-bold inline-flex items-center gap-0.5 mt-1">
              <PackageCheck className="w-3 h-3" /> 100% Verified Stock
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#2A1B69] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Low Stock Warning</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">2 Items</h3>
            <span className="text-[10px] text-amber-700 font-semibold mt-1 block">Coragen & Pioneer Seed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-lg text-[#2A1B69]">Weekly Revenue Trend (PKR)</h3>
            <p className="text-xs text-slate-500">Chaudhary Traders Sahiwal Daily Sales Performance</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
            Last 7 Days
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A651" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00A651" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#2A1B69', borderRadius: '12px', color: '#fff', border: 'none' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#00A651" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
