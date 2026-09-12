import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, Printer, CheckCircle, User, Phone, FileText, Filter, X, AlertCircle } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { fetchCategoriesApi, fetchProductsApi, fetchCustomersApi, createSaleApi } from '../../services/posApi';

const fallbackCatalog = [
  { id: 1, name: 'Sungro DAP Fertilizer (50kg)', category: 'Fertilizers', price: 12500, stock: 45, unit: '50kg Bag' },
  { id: 2, name: 'Sungro Sona Urea (50kg)', category: 'Fertilizers', price: 4600, stock: 120, unit: '50kg Bag' },
  { id: 3, name: 'Sungro Coragen Insecticide (100ml)', category: 'Pesticides', price: 3200, stock: 30, unit: '100ml Bottle' },
  { id: 4, name: 'Sungro Karate Insecticide (500ml)', category: 'Pesticides', price: 1850, stock: 25, unit: '500ml Bottle' },
  { id: 5, name: 'Sungro CAN Calcium Fertilizer (50kg)', category: 'Fertilizers', price: 3800, stock: 60, unit: '50kg Bag' },
  { id: 6, name: 'Sungro Hybrid Corn Seed (10kg)', category: 'Seeds', price: 11500, stock: 18, unit: '10kg Bag' },
  { id: 7, name: 'Sungro Belt Expert Insecticide (50ml)', category: 'Pesticides', price: 2900, stock: 40, unit: '50ml Bottle' },
  { id: 8, name: 'Sungro Zinc 33% Powder (1kg)', category: 'Micronutrients', price: 950, stock: 75, unit: '1kg Packet' },
];

export default function PosBilling() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoriesList, setCategoriesList] = useState(['All', 'Fertilizers', 'Pesticides', 'Seeds', 'Micronutrients']);
  const [products, setProducts] = useState(fallbackCatalog);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [cart, setCart] = useState([]);
  const [invoiceDone, setInvoiceDone] = useState(false);
  const [printedInvoice, setPrintedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load live categories and customer list on mount
  useEffect(() => {
    const loadInitData = async () => {
      const cats = await fetchCategoriesApi();
      if (cats && cats.length > 0) {
        setCategoriesList(['All', ...cats.map((c) => c.name)]);
      }

      const custs = await fetchCustomersApi();
      if (custs && custs.length > 0) {
        setCustomers(custs);
      }
    };
    loadInitData();
  }, []);

  // Load live products catalog on category or search change
  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProductsApi(selectedCategory, search);
    if (data && data.length > 0) {
      setProducts(data);
    } else if (!search && selectedCategory === 'All') {
      setProducts(fallbackCatalog);
    } else {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, search]);

  const handleSelectCustomer = (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    if (!custId) {
      setCustomerName('');
      setCustomerPhone('');
      return;
    }
    const found = customers.find((c) => String(c.id) === String(custId));
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone || 'N/A');
    }
  };

  const addToCart = (product) => {
    const stockAvailable = Number(product.stock !== undefined ? product.stock : product.stock_quantity || 0);
    if (stockAvailable <= 0) return;

    const existing = cart.find((item) => String(item.id) === String(product.id));
    if (existing) {
      if (existing.qty < stockAvailable) {
        setCart(cart.map((item) => (String(item.id) === String(product.id) ? { ...item, qty: item.qty + 1 } : item)));
      } else {
        alert(`Cannot add more than available stock (${stockAvailable} ${product.unit || 'units'}).`);
      }
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price || product.sale_price || 0),
          stock: stockAvailable,
          unit: product.unit || 'Bag',
          qty: 1,
          discount: 0,
        },
      ]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(
      cart
        .map((item) => {
          if (String(item.id) === String(id)) {
            const newQty = item.qty + delta;
            if (newQty > item.stock) {
              alert(`Cannot add more than available stock (${item.stock} ${item.unit || 'units'}).`);
              return item;
            }
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const updateItemDiscount = (id, disc) => {
    const cleanDisc = Math.max(0, Number(disc) || 0);
    setCart(cart.map((item) => (String(item.id) === String(id) ? { ...item, discount: cleanDisc } : item)));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => String(item.id) !== String(id)));
  };

  const grossSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItemDiscounts = cart.reduce((sum, item) => sum + (Number(item.discount) || 0), 0);
  const finalTotal = Math.max(0, grossSubtotal - totalItemDiscounts);

  const handleCheckout = async () => {
    if (cart.length === 0 || submitting) return;

    setErrorMsg(null);
    setSubmitting(true);

    const salePayload = {
      customer_id: selectedCustomerId ? parseInt(selectedCustomerId, 10) : null,
      customerName: customerName || 'Walk-in Farmer',
      customerPhone: customerPhone || 'N/A',
      items: cart.map((item) => ({
        product_id: parseInt(item.id, 10),
        id: item.id,
        name: item.name,
        unit: item.unit,
        quantity: item.qty,
        qty: item.qty,
        unit_price: item.price,
        price: item.price,
        discount: Number(item.discount) || 0,
        itemDiscount: Number(item.discount) || 0,
      })),
      total_amount: grossSubtotal,
      discount: totalItemDiscounts,
      grand_total: finalTotal,
      payment_method: paymentMethod,
    };

    const res = await createSaleApi(salePayload);
    setSubmitting(false);

    if (res.success && res.data) {
      setPrintedInvoice(res.data);
      setInvoiceDone(true);
      // Refresh live stock from backend so screen updates immediately
      loadProducts();
    } else {
      setErrorMsg(res.message || 'Failed to process checkout transaction.');
    }
  };

  const resetPos = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedCustomerId('');
    setErrorMsg(null);
    setInvoiceDone(false);
    setPrintedInvoice(null);
  };

  return (
    <div className="min-h-screen lg:h-full p-2.5 sm:p-3.5 max-w-full mx-auto flex flex-col font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch min-h-0 lg:h-full">
        {/* Left Section: Product Catalog */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col h-full overflow-hidden">
          {/* Top Search Bar & Counter */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Sungro products (DAP, Urea, Coragen, Seeds)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#F8FAFC] text-slate-800 text-xs rounded-lg pl-8 pr-7 py-1.5 border border-slate-200 outline-none focus:border-[#00A651]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
              {products.length} Items
            </span>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2.5 scrollbar-none border-b border-slate-100 shrink-0">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 pr-1 shrink-0">
              <Filter className="w-3 h-3 text-[#00A651]" /> Filter:
            </span>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#00A651] text-white shadow-2xs'
                    : 'bg-[#F8FAFC] text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Compact Product Grid */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 auto-rows-max">
            {loading ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs font-semibold">
                Loading Sungro inventory...
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs font-semibold">
                No products match filter.
              </div>
            ) : (
              products.map((product) => {
                const itemStock = Number(product.stock !== undefined ? product.stock : product.stock_quantity || 0);
                const itemPrice = Number(product.price !== undefined ? product.price : product.sale_price || 0);
                const isOutOfStock = itemStock <= 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => !isOutOfStock && addToCart(product)}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between min-h-[85px] shadow-2xs hover:shadow-sm ${
                      isOutOfStock
                        ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                        : 'bg-[#F8FAFC] border-slate-200/80 hover:bg-emerald-50/60 hover:border-[#00A651] cursor-pointer group'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[8.5px] font-extrabold uppercase px-1 py-0.2 rounded bg-slate-200/80 text-slate-700 truncate max-w-[70px]">
                          {product.category || 'General'}
                        </span>
                        {isOutOfStock ? (
                          <span className="text-[8.5px] font-extrabold uppercase px-1 py-0.2 rounded bg-red-100 text-red-700">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-semibold text-slate-500">{itemStock} left</span>
                        )}
                      </div>
                      <h4
                        className={`font-bold text-[10.5px] leading-tight line-clamp-2 ${
                          isOutOfStock ? 'text-slate-500' : 'text-[#2A1B69] group-hover:text-[#00A651] transition-colors'
                        }`}
                      >
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/40">
                      <span className="font-extrabold text-[11px] text-[#00A651]">
                        Rs. {itemPrice.toLocaleString()}
                      </span>
                      <button
                        disabled={isOutOfStock}
                        className={`px-1.5 py-0.5 rounded-md font-bold text-[9.5px] flex items-center gap-0.5 transition-colors ${
                          isOutOfStock
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-[#2A1B69] text-white group-hover:bg-[#00A651]'
                        }`}
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Section: Receipt & Billing */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col h-full overflow-hidden justify-between">
          <div className="flex flex-col h-full overflow-hidden">
            {/* Receipt Header */}
            <div className="flex items-center justify-between border-b pb-2 mb-2 shrink-0">
              <h3 className="font-bold text-xs text-[#2A1B69] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#00A651]" />
                Current Sale Receipt
              </h3>
              {cart.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#00A651] font-bold text-[10px]">
                  {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                </span>
              )}
            </div>

            {/* Farmer Inputs */}
            <div className="mb-2 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Farmer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#F8FAFC] text-[10.5px] rounded-md pl-6 pr-2 py-1 border border-slate-200 outline-none focus:border-[#00A651]"
                  />
                  <User className="w-3 h-3 text-slate-400 absolute left-2 top-1.5" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Mobile No."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#F8FAFC] text-[10.5px] rounded-md pl-6 pr-2 py-1 border border-slate-200 outline-none focus:border-[#00A651]"
                  />
                  <Phone className="w-3 h-3 text-slate-400 absolute left-2 top-1.5" />
                </div>
              </div>
            </div>

            {/* Error Toast / Alert Banner */}
            {errorMsg && (
              <div className="mb-2 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[10.5px] font-bold flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl my-2 min-h-0">
                No items added yet. Click products on left to build bill.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-1.5 py-1 pr-1 min-h-0">
                {cart.map((item) => {
                  const itemDiscount = Number(item.discount) || 0;
                  const itemTotal = Math.max(0, item.price * item.qty - itemDiscount);

                  return (
                    <div
                      key={item.id}
                      className="p-1.5 px-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200/80 hover:border-emerald-400 transition-all space-y-1 text-xs"
                    >
                      {/* Line 1: Product Name & Trash */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-[11px] text-slate-900 truncate leading-tight flex-1">
                          {item.name} <span className="text-[9px] font-normal text-slate-400">({item.unit})</span>
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                          className="p-0.5 rounded text-slate-400 hover:text-red-600 transition-colors shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line 2: Rate, Qty Controls, Disc Typing Input, Net Amount */}
                      <div className="flex items-center justify-between gap-1 text-[10px] pt-0.5 border-t border-slate-200/40">
                        <span className="text-[9.5px] text-slate-500 font-semibold truncate max-w-[110px]">
                          Rate: <strong className="text-slate-700">Rs.{item.price.toLocaleString()}</strong>
                        </span>

                        <div className="flex items-center bg-white border border-slate-300 rounded px-1 py-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="px-1 text-slate-600 hover:bg-slate-100 rounded text-[9.5px] font-bold"
                          >
                            -
                          </button>
                          <span className="font-extrabold px-1 min-w-[14px] text-center text-slate-800 text-[10px]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="px-1 text-slate-600 hover:bg-slate-100 rounded text-[9.5px] font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-0.5">
                          <span className="text-[9px] font-bold text-slate-400">Disc:</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={item.discount || ''}
                            onChange={(e) => updateItemDiscount(item.id, e.target.value)}
                            className="w-12 bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px] font-bold text-slate-800 text-right outline-none focus:border-[#00A651] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>

                        <span className="font-extrabold text-[#00A651] text-[11px] min-w-[55px] text-right">
                          Rs. {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Payment Method Selector & Bottom Checkout */}
            <div className="border-t pt-2 space-y-1 shrink-0 text-[11px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-600">Payment Method:</span>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="bg-[#F8FAFC] border border-slate-300 rounded px-1.5 py-0.5 text-[10.5px] font-bold text-slate-800 outline-none focus:border-[#00A651]"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit (Khata Account)</option>
                  <option value="Online">Online / EasyPaisa</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Gross Subtotal:</span>
                <span className="font-bold">Rs. {grossSubtotal.toLocaleString()}</span>
              </div>

              {totalItemDiscounts > 0 && (
                <div className="flex items-center justify-between text-red-600">
                  <span>Item Discounts:</span>
                  <span className="font-bold">- Rs. {totalItemDiscounts.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-extrabold text-[#2A1B69] pt-1 border-t">
                <span>Net Total:</span>
                <span className="text-[#00A651] text-sm">Rs. {finalTotal.toLocaleString()}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || submitting}
                className={`w-full mt-1.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all ${
                  cart.length > 0 && !submitting
                    ? 'bg-[#00A651] text-white hover:bg-[#008440] cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>{submitting ? 'Processing Sale...' : 'Print Receipt & Checkout'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Thermal Receipt Modal & Print Area */}
      {invoiceDone && printedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden">
          <div className="bg-slate-100 rounded-2xl w-[360px] max-w-[95vw] max-h-[90vh] p-3.5 shadow-2xl animate-fade-in font-sans border border-slate-300 flex flex-col justify-between overflow-hidden my-auto">
            {/* Header Tag */}
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 shrink-0 no-print">
              <span className="text-[10px] font-extrabold uppercase bg-[#2A1B69] text-white px-2 py-0.5 rounded-md tracking-wider">
                Official Sale Invoice
              </span>
              <button
                onClick={resetPos}
                className="text-slate-500 hover:text-red-600 transition-colors text-xs font-bold px-1.5 py-0.5 rounded hover:bg-slate-200"
              >
                ✕ Close
              </button>
            </div>

            {/* Printable Thermal Receipt Container */}
            <div
              id="thermal-receipt-print-area"
              className="bg-white w-full p-3 border border-slate-300 rounded-lg shadow-xs text-slate-900 text-[10.5px] space-y-2.5 font-mono overflow-y-auto flex-1 scrollbar-thin"
            >
              {/* Receipt Brand Header */}
              <div className="text-center border-b border-dashed border-slate-900 pb-2 flex flex-col items-center">
                <img src={logoImg} alt="Chaudhary Traders Logo" className="w-9 h-9 object-contain mb-1" />
                <h2 className="font-extrabold text-base text-slate-900 tracking-tight uppercase leading-none">
                  CHAUDHARY TRADERS
                </h2>
                <p className="text-[10px] font-bold text-slate-900 mt-1">Exclusive Dealer - Sungro Crop Care</p>
                <p className="text-[9px] text-slate-700 mt-0.5">Adda Sang Noor Shah, Sahiwal</p>
                <p className="text-[9px] text-slate-700">Helpline: 0341-4518001</p>
              </div>

              {/* Invoice Meta */}
              <div className="text-[10px] py-1 border-b border-dashed border-slate-900 space-y-0.5">
                <div className="flex justify-between">
                  <span><strong>Inv #:</strong> {printedInvoice.invoice_number || printedInvoice.invoiceNo || printedInvoice.id}</span>
                  <span><strong>Date:</strong> {String(printedInvoice.date || new Date().toLocaleDateString()).split(',')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Farmer:</strong> {printedInvoice.customerName || 'Walk-in Farmer'}</span>
                  <span><strong>Ph:</strong> {printedInvoice.customerPhone || 'N/A'}</span>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-dashed border-slate-900 font-bold uppercase text-[9px]">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Rate</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-slate-200">
                  {printedInvoice.items.map((item, index) => {
                    const itemQty = Number(item.qty || item.quantity || 1);
                    const itemPrice = Number(item.price || item.unit_price || 0);
                    const itemDisc = Number(item.itemDiscount || item.discount || 0);
                    const itemSubtotal = Number(item.subtotal || item.itemTotal || (itemPrice * itemQty - itemDisc));

                    return (
                      <tr key={index}>
                        <td className="py-1 pr-1 align-top">
                          <span className="font-bold block leading-tight text-slate-900">{item.name}</span>
                          <span className="text-[8.5px] text-slate-600 block">({item.unit || 'Unit'})</span>
                          {itemDisc > 0 && (
                            <span className="text-[8.5px] text-red-600 block font-semibold">
                              Disc: -Rs. {itemDisc.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-1 text-center font-bold align-top text-slate-900">{itemQty}</td>
                        <td className="py-1 text-right align-top text-slate-800">Rs. {itemPrice.toLocaleString()}</td>
                        <td className="py-1 text-right font-extrabold align-top text-slate-900">
                          Rs. {itemSubtotal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Invoice Calculations */}
              <div className="border-t border-dashed border-slate-900 pt-1.5 space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-800">
                  <span>Gross Subtotal:</span>
                  <span className="font-bold">Rs. {Number(printedInvoice.grossSubtotal || printedInvoice.total_amount || 0).toLocaleString()}</span>
                </div>

                {Number(printedInvoice.totalItemDiscounts || printedInvoice.discount || 0) > 0 && (
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Total Item Disc:</span>
                    <span>- Rs. {Number(printedInvoice.totalItemDiscounts || printedInvoice.discount || 0).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-dashed border-slate-900">
                  <span>NET TOTAL PAID:</span>
                  <span>Rs. {Number(printedInvoice.finalTotal || printedInvoice.grand_total || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Thermal Receipt Footer */}
              <div className="text-center pt-2 border-t border-dashed border-slate-900 text-[9px] text-slate-800 space-y-0.5">
                <p className="font-bold">Thank You For Your Visit!</p>
                <p>Sungro Certified 100% Genuine Products</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2.5 mt-2 w-full flex gap-2 border-t border-slate-200/80 shrink-0 no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-[#2A1B69] text-white text-xs font-bold hover:bg-[#1C114C] transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={resetPos}
                className="flex-1 py-2 rounded-xl bg-[#00A651] text-white text-xs font-bold hover:bg-[#008440] transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Sale</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
