import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, Printer, CheckCircle, User, Phone, FileText, Tag, Filter, X } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const initialCatalog = [
  { id: '1', name: 'Sungro DAP Fertilizer (50kg)', category: 'Fertilizers', price: 12500, stock: 45, unit: '50kg Bag' },
  { id: '2', name: 'Sungro Sona Urea (50kg)', category: 'Fertilizers', price: 4600, stock: 120, unit: '50kg Bag' },
  { id: '3', name: 'Sungro Coragen Insecticide (100ml)', category: 'Pesticides', price: 3200, stock: 30, unit: '100ml Bottle' },
  { id: '4', name: 'Sungro Karate Insecticide (500ml)', category: 'Pesticides', price: 1850, stock: 25, unit: '500ml Bottle' },
  { id: '5', name: 'Sungro CAN Calcium Fertilizer (50kg)', category: 'Fertilizers', price: 3800, stock: 60, unit: '50kg Bag' },
  { id: '6', name: 'Sungro Hybrid Corn Seed (10kg)', category: 'Seeds', price: 11500, stock: 18, unit: '10kg Bag' },
  { id: '7', name: 'Sungro Belt Expert Insecticide (50ml)', category: 'Pesticides', price: 2900, stock: 40, unit: '50ml Bottle' },
  { id: '8', name: 'Sungro Zinc 33% Powder (1kg)', category: 'Micronutrients', price: 950, stock: 75, unit: '1kg Packet' },
];

const categories = ['All', 'Fertilizers', 'Pesticides', 'Seeds', 'Micronutrients'];

export default function PosBilling() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [invoiceDone, setInvoiceDone] = useState(false);
  const [printedInvoice, setPrintedInvoice] = useState(null);

  const filteredProducts = initialCatalog.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.qty < product.stock) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)));
      }
    } else {
      setCart([...cart, { ...product, qty: 1, discount: 0 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const updateItemDiscount = (id, disc) => {
    const cleanDisc = Math.max(0, Number(disc) || 0);
    setCart(
      cart.map((item) => (item.id === id ? { ...item, discount: cleanDisc } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const grossSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItemDiscounts = cart.reduce((sum, item) => sum + (Number(item.discount) || 0), 0);
  const finalTotal = Math.max(0, grossSubtotal - totalItemDiscounts);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const invoiceData = {
      id: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString(),
      customerName: customerName || 'Walk-in Farmer',
      customerPhone: customerPhone || 'N/A',
      items: cart.map((item) => ({
        ...item,
        itemDiscount: Number(item.discount) || 0,
        itemTotal: Math.max(0, item.price * item.qty - (Number(item.discount) || 0)),
      })),
      grossSubtotal,
      totalItemDiscounts,
      finalTotal,
    };

    setPrintedInvoice(invoiceData);
    setInvoiceDone(true);
  };

  const resetPos = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setOverallDiscount(0);
    setInvoiceDone(false);
    setPrintedInvoice(null);
  };

  return (
    <div className="h-full p-2.5 sm:p-3.5 max-w-full mx-auto flex flex-col overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch h-full overflow-hidden">
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
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
              {filteredProducts.length} Items
            </span>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2.5 scrollbar-none border-b border-slate-100 shrink-0">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 pr-1 shrink-0">
              <Filter className="w-3 h-3 text-[#00A651]" /> Filter:
            </span>
            {categories.map((cat) => (
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
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-2.5 rounded-xl border border-slate-200/80 bg-[#F8FAFC] hover:bg-emerald-50/60 hover:border-[#00A651] transition-all cursor-pointer group flex flex-col justify-between min-h-[85px] shadow-2xs hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[8.5px] font-extrabold uppercase px-1 py-0.2 rounded bg-slate-200/80 text-slate-700 truncate max-w-[70px]">
                      {product.category}
                    </span>
                    <span className="text-[8.5px] font-semibold text-slate-500">
                      {product.stock} left
                    </span>
                  </div>
                  <h4 className="font-bold text-[10.5px] text-[#2A1B69] group-hover:text-[#00A651] transition-colors leading-tight line-clamp-2">
                    {product.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/40">
                  <span className="font-extrabold text-[11px] text-[#00A651]">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <button className="px-1.5 py-0.5 rounded-md bg-[#2A1B69] text-white font-bold text-[9.5px] flex items-center gap-0.5 group-hover:bg-[#00A651] transition-colors">
                    <Plus className="w-2.5 h-2.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Receipt & Billing (Fits 1 to 6 items with 0 scroll) */}
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
            <div className="grid grid-cols-2 gap-2 mb-2 shrink-0">
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

            {/* Cart Items List: Ultra-compact slim rows (~38px height) so 5-6 items fit 100% without scrollbar */}
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl my-2 min-h-[220px]">
                No items added yet. Click products on left to build bill.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-1.5 py-1 pr-1 min-h-[240px] max-h-[380px]">
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
                        {/* Rate */}
                        <span className="text-[9.5px] text-slate-500 font-semibold truncate max-w-[110px]">
                          Rate: <strong className="text-slate-700">Rs.{item.price.toLocaleString()}</strong>
                        </span>

                        {/* Qty Controls */}
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

                        {/* Direct Per-Item Discount Input */}
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

                        {/* Net Amount */}
                        <span className="font-extrabold text-[#00A651] text-[11px] min-w-[55px] text-right">
                          Rs. {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Summary & Checkout */}
            <div className="border-t pt-2 space-y-1 shrink-0 text-[11px]">
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
                disabled={cart.length === 0}
                className={`w-full py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                  cart.length > 0
                    ? 'bg-[#00A651] text-white hover:bg-[#008440]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt & Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Printed Thermal Receipt Modal Simulation */}
      {invoiceDone && printedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in font-sans border border-slate-200">
            {/* Printable Thermal Receipt Container */}
            <div className="bg-white p-4 border border-slate-300 rounded-xl shadow-inner text-slate-800 text-xs space-y-3">
              {/* Receipt Brand Header */}
              <div className="text-center border-b border-dashed border-slate-400 pb-3 flex flex-col items-center">
                <img src={logoImg} alt="Chaudhary Traders Logo" className="w-12 h-12 object-contain mb-1" />
                <h2 className="font-extrabold text-lg text-[#2A1B69] tracking-tight uppercase">
                  CHAUDHARY TRADERS
                </h2>
                <p className="text-[11px] font-bold text-[#00A651]">Official Exclusive Dealer - Sungro Crop Care</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Adda Sang Noor Shah, Sahiwal | Helpline: 0341 4518001</p>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-2 text-[11px] py-1 border-b border-dashed border-slate-400">
                <div>
                  <p><strong>Invoice No:</strong> {printedInvoice.id}</p>
                  <p><strong>Farmer:</strong> {printedInvoice.customerName}</p>
                </div>
                <div className="text-right">
                  <p><strong>Date:</strong> {printedInvoice.date}</p>
                  <p><strong>Phone:</strong> {printedInvoice.customerPhone}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-400 text-[10px] uppercase font-bold text-slate-600">
                    <th className="py-1">#</th>
                    <th className="py-1">Item Description</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Rate</th>
                    <th className="py-1 text-right">Disc</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {printedInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-1.5 font-semibold text-slate-400 align-top">{index + 1}</td>
                      <td className="py-1.5 pr-1 align-top">
                        <span className="font-bold text-slate-800 block">{item.name}</span>
                        <span className="text-[9.5px] text-slate-500 font-medium">Size/Packing: {item.unit}</span>
                      </td>
                      <td className="py-1.5 text-center font-bold align-top">{item.qty}</td>
                      <td className="py-1.5 text-right align-top">Rs. {item.price.toLocaleString()}</td>
                      <td className="py-1.5 text-right text-red-600 align-top">
                        {item.itemDiscount > 0 ? `Rs. ${item.itemDiscount.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-1.5 text-right font-extrabold text-slate-900 align-top">
                        Rs. {item.itemTotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Invoice Calculations */}
              <div className="border-t border-dashed border-slate-400 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Subtotal:</span>
                  <span className="font-bold">Rs. {printedInvoice.grossSubtotal.toLocaleString()}</span>
                </div>

                {printedInvoice.totalItemDiscounts > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Total Item Discounts:</span>
                    <span>- Rs. {printedInvoice.totalItemDiscounts.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-extrabold text-[#2A1B69] pt-2 border-t border-slate-400">
                  <span>NET TOTAL PAID:</span>
                  <span className="text-[#00A651]">Rs. {printedInvoice.finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-2 border-t border-dashed border-slate-400 text-[10px] text-slate-500">
                <p className="font-bold text-slate-700">Thank You For Your Business!</p>
                <p>Sungro Certified 100% Genuine Crop Products</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#2A1B69] text-white text-xs font-bold hover:bg-[#1C114C] transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt Now</span>
              </button>
              <button
                onClick={resetPos}
                className="flex-1 py-2.5 rounded-xl bg-[#00A651] text-white text-xs font-bold hover:bg-[#008440] transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Sale</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
