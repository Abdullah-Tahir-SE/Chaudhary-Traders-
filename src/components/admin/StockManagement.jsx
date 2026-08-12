import React, { useState } from 'react';
import { Search, Plus, Edit2, AlertCircle, CheckCircle2, X } from 'lucide-react';

const initialStockData = [
  { id: 'SKU-001', name: 'Sungro DAP Fertilizer (50kg)', category: 'Fertilizers', supplier: 'Sungro Crop Care Ltd', stock: 145, minStock: 20, price: 12500, unit: 'Bag' },
  { id: 'SKU-002', name: 'Sungro Sona Urea (50kg)', category: 'Fertilizers', supplier: 'Sungro Crop Care Ltd', stock: 220, minStock: 50, price: 4600, unit: 'Bag' },
  { id: 'SKU-003', name: 'Sungro Coragen Insecticide (100ml)', category: 'Pesticides', supplier: 'Sungro Crop Care Ltd', stock: 8, minStock: 15, price: 3200, unit: 'Bottle' },
  { id: 'SKU-004', name: 'Sungro Amistar Fungicide (250ml)', category: 'Pesticides', supplier: 'Sungro Crop Care Ltd', stock: 35, minStock: 10, price: 4200, unit: 'Bottle' },
  { id: 'SKU-005', name: 'Sungro CAN Fertilizer (50kg)', category: 'Fertilizers', supplier: 'Sungro Crop Care Ltd', stock: 85, minStock: 25, price: 3800, unit: 'Bag' },
  { id: 'SKU-006', name: 'Sungro Hybrid Maize Seed (10kg)', category: 'Seeds', supplier: 'Sungro Crop Care Ltd', stock: 4, minStock: 10, price: 11500, unit: 'Bag' },
  { id: 'SKU-007', name: 'Sungro Belt Insecticide (50ml)', category: 'Pesticides', supplier: 'Sungro Crop Care Ltd', stock: 50, minStock: 15, price: 2900, unit: 'Bottle' },
  { id: 'SKU-008', name: 'Sungro Zinc 33% Powder (1kg)', category: 'Micronutrients', supplier: 'Sungro Crop Care Ltd', stock: 95, minStock: 20, price: 950, unit: 'Packet' },
];

export default function StockManagement() {
  const [items, setItems] = useState(initialStockData);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editingItem, setEditingItem] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', category: 'Fertilizers', supplier: 'Sungro Crop Care Ltd', stock: 50, price: 1000, unit: 'Bag' });

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleUpdateStock = () => {
    if (!editingItem) return;
    setItems(items.map((i) => (i.id === editingItem.id ? { ...i, stock: Number(newStockVal) } : i)));
    setEditingItem(null);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const created = {
      ...newProd,
      id: `SKU-00${items.length + 1}`,
      minStock: 10,
    };
    setItems([...items, created]);
    setShowAddModal(false);
    setNewProd({ name: '', category: 'Fertilizers', supplier: 'Sungro Crop Care Ltd', stock: 50, price: 1000, unit: 'Bag' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top Title & Quick Add */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2A1B69]">Sungro Inventory & Stock Management</h1>
          <p className="text-xs text-slate-500">Track Sungro fertilizer bags, spray bottles, hybrid seed stocks and reorder levels</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#00A651] text-white font-extrabold text-xs flex items-center gap-2 hover:bg-[#008440] shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stock SKU</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search stock item or SKU code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8FAFC] text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-200 outline-none focus:border-[#00A651]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {['ALL', 'Fertilizers', 'Pesticides', 'Seeds', 'Micronutrients'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-[#2A1B69] text-white'
                  : 'bg-[#F8FAFC] text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#2A1B69] text-white uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">SKU Code</th>
                <th className="py-3.5 px-4">Product Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Supplier / Brand</th>
                <th className="py-3.5 px-4 text-right">Unit Price</th>
                <th className="py-3.5 px-4 text-center">Current Stock</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isLow = item.stock <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">{item.id}</td>
                    <td className="py-3 px-4 font-bold text-[#2A1B69]">{item.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{item.supplier}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#00A651]">
                      Rs. {item.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                      {item.stock} {item.unit}s
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-[#00A651] text-[10px] font-extrabold">
                          <CheckCircle2 className="w-3 h-3" /> In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setNewStockVal(item.stock);
                        }}
                        className="p-1.5 rounded-lg bg-[#2A1B69] text-white hover:bg-[#00A651] transition-colors"
                        title="Edit stock level"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#2A1B69]">Update Stock Level</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-3 font-bold">{editingItem.name}</p>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">New Stock Quantity ({editingItem.unit}s):</label>
              <input
                type="number"
                value={newStockVal}
                onChange={(e) => setNewStockVal(e.target.value)}
                className="w-full bg-[#F8FAFC] border rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-[#00A651]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                className="flex-1 py-2 rounded-xl bg-[#00A651] text-white text-xs font-bold hover:bg-[#008440]"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddProduct} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#2A1B69]">Add New Product SKU</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title:</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sungro Coragen 100ml"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full bg-[#F8FAFC] border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category:</label>
                <select
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  className="w-full bg-[#F8FAFC] border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]"
                >
                  <option value="Fertilizers">Fertilizers</option>
                  <option value="Pesticides">Pesticides</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Micronutrients">Micronutrients</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier Brand:</label>
                <input
                  required
                  type="text"
                  placeholder="Sungro Crop Care Ltd"
                  value={newProd.supplier}
                  onChange={(e) => setNewProd({ ...newProd, supplier: e.target.value })}
                  className="w-full bg-[#F8FAFC] border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock:</label>
                  <input
                    required
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (PKR):</label>
                  <input
                    required
                    type="number"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full bg-[#F8FAFC] border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#00A651] text-white text-xs font-bold hover:bg-[#008440]"
              >
                Add SKU
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
