import React, { useState, useEffect } from 'react';
import { Search, Users, ShieldCheck, UserCheck, Trash2, X, RefreshCw, AlertCircle, Phone, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';
import { fetchAdminCustomersApi, deleteAdminCustomerApi } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

export default function UserManagement() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingName, setDeletingName] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    const data = await fetchAdminCustomersApi(token, search);
    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers();
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDeleteCustomer = async (id) => {
    const res = await deleteAdminCustomerApi(token, id);
    if (res.success) {
      setCustomers(customers.filter((c) => c.id !== id));
      setDeletingId(null);
    } else {
      alert(res.message || 'Failed to delete customer.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Title & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2A1B69]">Customer Directory & Khata Ledger</h1>
          <p className="text-xs text-slate-500">
            Live PostgreSQL customer directory, farmer credit balances & account management
          </p>
        </div>

        <button
          onClick={loadCustomers}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-100 transition-all shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#00A651] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Customers</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search customer by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8FAFC] text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-200 outline-none focus:border-[#00A651]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            Total Farmers: {customers.length}
          </span>
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#2A1B69] text-white uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Farmer / Customer Name</th>
                <th className="py-3.5 px-4">Contact Phone & Email</th>
                <th className="py-3.5 px-4">Address / Village</th>
                <th className="py-3.5 px-4 text-right">Khata Balance</th>
                <th className="py-3.5 px-4 text-right">Joined Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-bold">
                    Loading customer accounts from database...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-bold">
                    No customer accounts found matching criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#00A651] font-black text-xs flex items-center justify-center border border-emerald-200">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-[#2A1B69] block text-xs">{c.name}</span>
                          <span className="text-[10px] text-slate-400">ID: #{c.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="text-slate-800 font-bold flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#00A651]" /> {c.phone || 'N/A'}
                        </span>
                        {c.email ? (
                          <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" /> {c.email}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {c.address || 'Sahiwal, Punjab'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-black text-xs ${
                          c.balance > 0 ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200' : 'text-[#00A651]'
                        }`}
                      >
                        Rs. {Number(c.balance || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center justify-end gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {String(c.createdAt || new Date().toISOString()).split('T')[0]}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setDeletingId(c.id);
                          setDeletingName(c.name);
                        }}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                        title="Delete customer account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Customer Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-base text-red-600 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" /> Delete Customer Account
              </h3>
              <button onClick={() => setDeletingId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to delete farmer account <strong className="text-slate-900">{deletingName}</strong> (ID #{deletingId}) from the database?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCustomer(deletingId)}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
