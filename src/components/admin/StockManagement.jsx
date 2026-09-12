import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, AlertCircle, CheckCircle2, X, Upload, Calendar, FileText, Hash, Image as ImageIcon } from 'lucide-react';
import { fetchCategoriesApi, fetchProductsApi, createProductApi, updateProductApi, deleteProductApi } from '../../services/posApi';

const fallbackStockData = [
  { id: 1, name: 'Sungro DAP Fertilizer (50kg)', category: 'Fertilizers', supplier: 'Sungro Crop Care Ltd', stock: 145, minStock: 20, price: 12500, unit: 'Bag', invoiceNo: 'INV-90412', batchNo: 'BATCH-DAP-88', expiryDate: '2028-11-30', image: null },
  { id: 2, name: 'Sungro Sona Urea (50kg)', category: 'Fertilizers', supplier: 'Sungro Crop Care Ltd', stock: 220, minStock: 50, price: 4600, unit: 'Bag', invoiceNo: 'INV-90413', batchNo: 'BATCH-UREA-12', expiryDate: '2029-05-15', image: null },
  { id: 3, name: 'Sungro Coragen Insecticide (100ml)', category: 'Pesticides', supplier: 'Sungro Crop Care Ltd', stock: 30, minStock: 15, price: 3200, unit: 'Bottle', invoiceNo: 'INV-88120', batchNo: 'LOT-COR-55', expiryDate: '2027-08-20', image: null },
  { id: 4, name: 'Sungro Amistar Fungicide (250ml)', category: 'Pesticides', supplier: 'Sungro Crop Care Ltd', stock: 35, minStock: 10, price: 4200, unit: 'Bottle', invoiceNo: 'INV-88121', batchNo: 'LOT-AMI-99', expiryDate: '2027-10-10', image: null },
];

export default function StockManagement() {
  const [items, setItems] = useState(fallbackStockData);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [categoriesList, setCategoriesList] = useState(['ALL', 'Fertilizers', 'Pesticides', 'Seeds', 'Micronutrients']);
  const [editingProd, setEditingProd] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    category_id: 1,
    category: 'Fertilizers',
    supplier: 'Sungro Crop Care Ltd',
    stock: 50,
    price: 1000,
    costPrice: 800,
    unit: 'Bag',
    invoiceNo: '',
    batchNo: '',
    expiryDate: '',
    image: null,
  });

  const loadStockData = async () => {
    setLoading(true);
    const prods = await fetchProductsApi(categoryFilter, search);
    if (prods && prods.length > 0) {
      setItems(prods);
    } else if (!search && categoryFilter === 'ALL') {
      setItems(fallbackStockData);
    } else {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadCats = async () => {
      const cats = await fetchCategoriesApi();
      if (cats && cats.length > 0) {
        setCategoriesList(['ALL', ...cats.map((c) => c.name)]);
      }
    };
    loadCats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStockData();
    }, 200);
    return () => clearTimeout(timer);
  }, [categoryFilter, search]);

  const handleDeleteProduct = async (id) => {
    try {
      const res = await deleteProductApi(id);
      if (res.success) {
        alert('Product deleted successfully!');
        await loadStockData();
      } else {
        alert(res.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Network error while deleting product.');
    }
    setDeletingId(null);
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProd) return;

    try {
      const payload = {
        name: editingProd.name.trim(),
        category_id: parseInt(editingProd.category_id || 1, 10),
        sku: editingProd.sku,
        supplier: editingProd.supplier,
        invoice_number: editingProd.invoiceNo || editingProd.invoice_number,
        batch_number: editingProd.batchNo || editingProd.batch_number,
        expiry_date: editingProd.expiryDate || editingProd.expiry_date,
        cost_price: parseFloat(editingProd.costPrice || editingProd.cost_price || 0),
        sale_price: parseFloat(editingProd.price || editingProd.sale_price || 0),
        stock_quantity: parseInt(editingProd.stock || editingProd.stock_quantity || 0, 10),
        unit: editingProd.unit,
        image_url: editingProd.image || editingProd.image_url,
      };

      const res = await updateProductApi(editingProd.id, payload);
      if (res.success) {
        alert('Product updated successfully!');
        await loadStockData();
        setEditingProd(null);
      } else {
        alert(res.message || 'Failed to update product.');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Network error while updating product.');
    }
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProd((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProd((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProd.name.trim(),
        category_id: parseInt(newProd.category_id || 1, 10),
        sku: newProd.sku ? newProd.sku.trim() : `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier: newProd.supplier ? newProd.supplier.trim() : 'Sungro Crop Care Ltd',
        invoice_number: newProd.invoiceNo ? newProd.invoiceNo.trim() : null,
        batch_number: newProd.batchNo ? newProd.batchNo.trim() : null,
        expiry_date: newProd.expiryDate || '2028-12-31',
        cost_price: parseFloat(newProd.costPrice || 0),
        sale_price: parseFloat(newProd.price || 0),
        stock_quantity: parseInt(newProd.stock || 0, 10),
        min_stock: parseInt(newProd.minStock || 10, 10),
        unit: newProd.unit ? newProd.unit.trim() : 'Bag',
        image_url: newProd.image || null,
      };

      const res = await createProductApi(payload);

      if (res.success) {
        alert('Product added successfully to database!');
        await loadStockData();
        setShowAddModal(false);
        setNewProd({
          name: '',
          category_id: 1,
          category: 'Fertilizers',
          supplier: 'Sungro Crop Care Ltd',
          stock: 50,
          price: 1000,
          costPrice: 800,
          unit: 'Bag',
          invoiceNo: '',
          batchNo: '',
          expiryDate: '',
          image: null,
        });
      } else {
        alert(res.message || 'Failed to add product.');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Network error while adding product.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Top Title & Quick Add */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2A1B69]">Sungro Inventory & Stock Management</h1>
          <p className="text-xs text-slate-500">
            Track Sungro fertilizer bags, spray bottles, hybrid seed stocks, batch numbers & expiry dates
          </p>
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search stock, SKU, Invoice # or Batch #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8FAFC] text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-200 outline-none focus:border-[#00A651]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === cat ? 'bg-[#2A1B69] text-white' : 'bg-[#F8FAFC] text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#2A1B69] text-white uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="py-3.5 px-3">Item</th>
                <th className="py-3.5 px-3">SKU / Invoice</th>
                <th className="py-3.5 px-3">Product Description</th>
                <th className="py-3.5 px-3">Batch #</th>
                <th className="py-3.5 px-3">Expiry Date</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3 text-right">Unit Price</th>
                <th className="py-3.5 px-3 text-center">Stock</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-slate-400 font-bold">
                    Loading inventory records...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-slate-400 font-bold">
                    No matching products found.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const itemStock = Number(item.stock !== undefined ? item.stock : item.stock_quantity || 0);
                  const itemMinStock = Number(item.minStock !== undefined ? item.minStock : item.min_stock || 10);
                  const itemPrice = Number(item.price !== undefined ? item.price : item.sale_price || 0);
                  const isLow = itemStock <= itemMinStock;
                  const itemImg = item.image || item.image_url;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      {/* Thumbnail Image */}
                      <td className="py-3 px-3">
                        {itemImg ? (
                          <img src={itemImg} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00A651]">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      {/* SKU & Invoice */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-800 block">{item.sku || `SKU-00${item.id}`}</span>
                        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5">
                          <FileText className="w-2.5 h-2.5 text-[#00A651]" /> {item.invoiceNo || item.invoice_number || 'N/A'}
                        </span>
                      </td>
                      {/* Product Name & Brand */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#2A1B69] block leading-tight">{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.supplier || 'Sungro Crop Care Ltd'}</span>
                      </td>
                      {/* Batch Number */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-mono font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10.5px]">
                          <Hash className="w-2.5 h-2.5 text-[#2A1B69]" /> {item.batchNo || item.batch_number || 'N/A'}
                        </span>
                      </td>
                      {/* Expiry Date */}
                      <td className="py-3 px-3">
                        <span className="text-slate-700 font-semibold flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-amber-600" />{' '}
                          {item.expiryDate ? String(item.expiryDate).split('T')[0] : item.expiry_date ? String(item.expiry_date).split('T')[0] : 'N/A'}
                        </span>
                      </td>
                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600 text-[10.5px]">
                          {item.category || 'Fertilizers'}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="py-3 px-3 text-right font-extrabold text-[#00A651]">
                        Rs. {itemPrice.toLocaleString()}
                      </td>
                      {/* Current Stock */}
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {itemStock} {item.unit || 'Bags'}
                      </td>
                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {itemStock <= 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                            <AlertCircle className="w-3 h-3 text-amber-600" /> Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#00A651] text-[10px] font-extrabold">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingProd({ ...item, stock: itemStock, price: itemPrice })}
                            className="p-1.5 rounded-lg bg-[#2A1B69] text-white hover:bg-[#00A651] transition-colors"
                            title="Edit full product details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(item.id)}
                            className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="Delete product SKU"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-base text-red-600 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" /> Delete Product SKU
              </h3>
              <button onClick={() => setDeletingId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to delete SKU <strong className="text-slate-900">{deletingId}</strong> from inventory?
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={() => handleDeleteProduct(deletingId)} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm">
                Delete SKU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Edit Product SKU Modal */}
      {editingProd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveEditProduct}
            className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-fade-in border border-slate-200 max-h-[92vh] flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 shrink-0">
              <div>
                <h3 className="font-extrabold text-base text-[#2A1B69]">Edit Product SKU ({editingProd.id})</h3>
                <p className="text-[11px] text-slate-500">Update product title, category, stock, price, batch & picture</p>
              </div>
              <button type="button" onClick={() => setEditingProd(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs overflow-y-auto flex-1 pr-1 pb-2 scrollbar-thin">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#00A651]" /> Product Picture:
                </label>
                <div className="flex items-center gap-3 bg-[#F8FAFC] border border-dashed border-slate-300 rounded-xl p-3">
                  {editingProd.image || editingProd.image_url ? (
                    <div className="relative group shrink-0">
                      <img src={editingProd.image || editingProd.image_url} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-slate-300" />
                      <button type="button" onClick={() => setEditingProd({ ...editingProd, image: null, image_url: null })} className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow-sm hover:bg-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00A651] shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1B69] text-white font-bold text-[11px] hover:bg-[#1C114C] transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{editingProd.image ? 'Change Photo' : 'Upload Image'}</span>
                      <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                    </label>
                    <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title:</label>
                <input required type="text" value={editingProd.name} onChange={(e) => setEditingProd({ ...editingProd, name: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category:</label>
                  <select value={editingProd.category_id || 1} onChange={(e) => setEditingProd({ ...editingProd, category_id: parseInt(e.target.value, 10) })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]">
                    <option value={1}>Fertilizers</option>
                    <option value={2}>Pesticides</option>
                    <option value={3}>Seeds</option>
                    <option value={4}>Micronutrients</option>
                    <option value={5}>Tools & Machinery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supplier Brand:</label>
                  <input required type="text" value={editingProd.supplier || ''} onChange={(e) => setEditingProd({ ...editingProd, supplier: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#00A651]" /> Invoice Number:
                  </label>
                  <input type="text" value={editingProd.invoiceNo || editingProd.invoice_number || ''} onChange={(e) => setEditingProd({ ...editingProd, invoiceNo: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[#00A651]" /> Batch / Lot Number:
                  </label>
                  <input type="text" value={editingProd.batchNo || editingProd.batch_number || ''} onChange={(e) => setEditingProd({ ...editingProd, batchNo: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-600" /> Expiry Date:
                  </label>
                  <input type="date" value={editingProd.expiryDate ? String(editingProd.expiryDate).split('T')[0] : ''} onChange={(e) => setEditingProd({ ...editingProd, expiryDate: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Packing Unit:</label>
                  <input type="text" value={editingProd.unit || ''} onChange={(e) => setEditingProd({ ...editingProd, unit: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity:</label>
                  <input required type="number" value={editingProd.stock !== undefined ? editingProd.stock : editingProd.stock_quantity} onChange={(e) => setEditingProd({ ...editingProd, stock: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (PKR):</label>
                  <input required type="number" value={editingProd.price !== undefined ? editingProd.price : editingProd.sale_price} onChange={(e) => setEditingProd({ ...editingProd, price: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <button type="button" onClick={() => setEditingProd(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#00A651] text-white text-xs font-bold hover:bg-[#008440] transition-colors shadow-sm">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleAddProduct}
            className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-fade-in border border-slate-200 max-h-[92vh] flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 shrink-0">
              <div>
                <h3 className="font-extrabold text-base text-[#2A1B69]">Add New Product SKU</h3>
                <p className="text-[11px] text-slate-500">Enter product details, batch number, expiry date & image</p>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs overflow-y-auto flex-1 pr-1 pb-2 scrollbar-thin">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#00A651]" /> Product Picture Upload:
                </label>
                <div className="flex items-center gap-3 bg-[#F8FAFC] border border-dashed border-slate-300 rounded-xl p-3">
                  {newProd.image ? (
                    <div className="relative group shrink-0">
                      <img src={newProd.image} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-slate-300" />
                      <button type="button" onClick={() => setNewProd({ ...newProd, image: null })} className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow-sm hover:bg-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00A651] shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1B69] text-white font-bold text-[11px] hover:bg-[#1C114C] transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{newProd.image ? 'Change Photo' : 'Upload Image'}</span>
                      <input type="file" accept="image/*" onChange={handleAddImageChange} className="hidden" />
                    </label>
                    <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title:</label>
                <input required type="text" placeholder="e.g. Sungro Coragen 100ml" value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category:</label>
                  <select value={newProd.category_id} onChange={(e) => setNewProd({ ...newProd, category_id: parseInt(e.target.value, 10) })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]">
                    <option value={1}>Fertilizers</option>
                    <option value={2}>Pesticides</option>
                    <option value={3}>Seeds</option>
                    <option value={4}>Micronutrients</option>
                    <option value={5}>Tools & Machinery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supplier Brand:</label>
                  <input required type="text" placeholder="Sungro Crop Care Ltd" value={newProd.supplier} onChange={(e) => setNewProd({ ...newProd, supplier: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#00A651]" /> Invoice Number:
                  </label>
                  <input type="text" placeholder="e.g. INV-90412" value={newProd.invoiceNo} onChange={(e) => setNewProd({ ...newProd, invoiceNo: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[#00A651]" /> Batch / Lot Number:
                  </label>
                  <input type="text" placeholder="e.g. BATCH-DAP-88" value={newProd.batchNo} onChange={(e) => setNewProd({ ...newProd, batchNo: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-600" /> Expiry Date:
                  </label>
                  <input type="date" value={newProd.expiryDate} onChange={(e) => setNewProd({ ...newProd, expiryDate: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Packing Unit:</label>
                  <input type="text" placeholder="Bag / Bottle / Packet" value={newProd.unit} onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Quantity:</label>
                  <input required type="number" value={newProd.stock} onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (PKR):</label>
                  <input required type="number" value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00A651]" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#00A651] text-white text-xs font-bold hover:bg-[#008440] transition-colors shadow-sm">
                Add Product SKU
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
