import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShoppingBag, MessageSquare, Tag, Filter } from 'lucide-react';
import TopBar from '../../components/public/TopBar';
import Navbar from '../../components/public/Navbar';
import SiteFooter from '../../components/public/SiteFooter';
import catFertilizer from '../../assets/cat-fertilizer.jpg';
import catSpray from '../../assets/cat-spray.jpg';
import catSeeds from '../../assets/cat-seeds.jpg';
import catMicro from '../../assets/cat-micronutrients.jpg';

const catalog = [
  { id: '1', name: 'Sungro DAP Fertilizer (50kg Bag)', category: 'fertilizers', categoryLabel: 'Fertilizers', brand: 'Sungro Crop Care', price: 12500, image: catFertilizer, desc: 'Highest quality Diammonium Phosphate from Sungro for root strength and early plant development.' },
  { id: '2', name: 'Sungro Sona Urea (50kg Bag)', category: 'fertilizers', categoryLabel: 'Fertilizers', brand: 'Sungro Crop Care', price: 4600, image: catFertilizer, desc: 'High nitrogen prilled urea from Sungro for vigorous vegetative growth and green foliage.' },
  { id: '3', name: 'Sungro Coragen Insecticide (100ml)', category: 'pesticides', categoryLabel: 'Pesticides & Sprays', brand: 'Sungro Crop Care', price: 3200, image: catSpray, desc: 'Broad-spectrum Rynaxypyr spray from Sungro against bollworms and armyworms.' },
  { id: '4', name: 'Sungro Karate Insecticide (500ml)', category: 'pesticides', categoryLabel: 'Pesticides & Sprays', brand: 'Sungro Crop Care', price: 1850, image: catSpray, desc: 'Lambda-cyhalothrin insecticide from Sungro for sucking and chewing pests.' },
  { id: '5', name: 'Sungro CAN Calcium Fertilizer (50kg)', category: 'fertilizers', categoryLabel: 'Fertilizers', brand: 'Sungro Crop Care', price: 3800, image: catFertilizer, desc: 'Calcium Ammonium Nitrate from Sungro for balanced nitrogen and soil calcium fortification.' },
  { id: '6', name: 'Sungro Hybrid Corn Seed (10kg)', category: 'seeds', categoryLabel: 'Hybrid Seeds', brand: 'Sungro Crop Care', price: 11500, image: catSeeds, desc: 'Premium Sungro hybrid corn seed with drought tolerance and heavy grain yield ratio.' },
  { id: '7', name: 'Sungro Belt Expert Insecticide (50ml)', category: 'pesticides', categoryLabel: 'Pesticides & Sprays', brand: 'Sungro Crop Care', price: 2900, image: catSpray, desc: 'Flubendiamide + Thiacloprid combination spray from Sungro for stubborn caterpillars.' },
  { id: '8', name: 'Sungro Zinc 33% Powder (1kg Packet)', category: 'micronutrients', categoryLabel: 'Micronutrients', brand: 'Sungro Crop Care', price: 950, image: catMicro, desc: 'Chelated zinc sulphate from Sungro for correcting zinc deficiency in rice, wheat and maize.' },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCat(cat);
    const s = searchParams.get('search');
    if (s) setSearchQuery(s);
  }, [searchParams]);

  const filteredProducts = catalog.filter((prod) => {
    const matchesCat = selectedCat === 'all' || prod.category === selectedCat;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <TopBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-[#00A651] text-xs font-extrabold uppercase tracking-widest border border-emerald-200">
            <Tag className="w-3.5 h-3.5" /> Official Sungro Catalog
          </span>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#2A1B69]">
            Sungro Fertilizers, Sprays & Seeds Store
          </h1>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
            Browse our full stock of original Sungro company-sealed products available at Adda Sang Noor Shah, Sahiwal.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search Sungro DAP, Urea, Coragen, Seeds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-200 outline-none focus:border-[#00A651]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            {[
              { id: 'all', label: 'All Products' },
              { id: 'fertilizers', label: 'Fertilizers' },
              { id: 'pesticides', label: 'Pesticides & Sprays' },
              { id: 'seeds', label: 'Hybrid Seeds' },
              { id: 'micronutrients', label: 'Micronutrients' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  selectedCat === cat.id
                    ? 'bg-[#00A651] text-white shadow-md'
                    : 'bg-[#F8FAFC] text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-base">No matching products found</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#2A1B69] text-[#00A651] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow">
                      {product.brand}
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      {product.categoryLabel}
                    </span>
                    <h3 className="font-bold text-[#2A1B69] text-sm leading-snug group-hover:text-[#00A651] transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {product.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Retail Rate:</span>
                    <span className="font-extrabold text-base text-[#00A651]">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/923414518001?text=Hello%20Chaudhary%20Traders,%20I%20want%20to%20buy%20or%20inquire%20about:%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00A651] text-white font-extrabold text-xs hover:bg-[#008440] transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
