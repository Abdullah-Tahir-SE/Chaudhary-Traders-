import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShoppingBag, MessageSquare, Tag, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import TopBar from '../../components/public/TopBar';
import Navbar from '../../components/public/Navbar';
import SiteFooter from '../../components/public/SiteFooter';
import catFertilizer from '../../assets/cat-fertilizer.jpg';
import catSpray from '../../assets/cat-spray.jpg';
import catSeeds from '../../assets/cat-seeds.jpg';
import catMicro from '../../assets/cat-micronutrients.jpg';
import { fetchProductsApi, fetchCategoriesApi } from '../../services/posApi';

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [dbProducts, setDbProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([
    { id: 'all', label: 'All Products' },
    { id: 'fertilizers', label: 'Fertilizers' },
    { id: 'pesticides', label: 'Pesticides & Sprays' },
    { id: 'seeds', label: 'Hybrid Seeds' },
    { id: 'micronutrients', label: 'Micronutrients' },
    { id: 'tools & machinery', label: 'Tools & Machinery' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCat(cat.toLowerCase());
    const s = searchParams.get('search');
    if (s) setSearchQuery(s);
  }, [searchParams]);

  // Load Categories from Live PostgreSQL Database
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategoriesApi();
      if (cats && cats.length > 0) {
        const formatted = [
          { id: 'all', label: 'All Products' },
          ...cats.map((c) => ({
            id: c.name.toLowerCase(),
            label: c.name,
          })),
        ];
        setCategoriesList(formatted);
      }
    };
    loadCategories();
  }, []);

  // Load Products from Live PostgreSQL Database
  const loadLiveProducts = async () => {
    setLoading(true);
    const data = await fetchProductsApi('All', searchQuery);
    if (data && data.length > 0) {
      setDbProducts(data);
    } else {
      setDbProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLiveProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getProductImage = (prod) => {
    if (prod.image) return prod.image;
    if (prod.image_url) return prod.image_url;
    const catName = (prod.category || '').toLowerCase();
    if (catName.includes('fertilizer')) return catFertilizer;
    if (catName.includes('pesticide') || catName.includes('spray')) return catSpray;
    if (catName.includes('seed')) return catSeeds;
    if (catName.includes('micro') || catName.includes('nutri')) return catMicro;
    return catFertilizer;
  };

  const filteredProducts = dbProducts.filter((prod) => {
    const prodCat = (prod.category || '').toLowerCase();
    const matchesCat = selectedCat === 'all' || prodCat.includes(selectedCat) || selectedCat.includes(prodCat);
    const matchesSearch =
      !searchQuery ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.supplier || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <TopBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-[#00A651] text-xs font-extrabold uppercase tracking-widest border border-emerald-200">
            <Tag className="w-3.5 h-3.5" /> Official Sungro Live Catalog
          </span>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#2A1B69]">
            Sungro Fertilizers, Sprays & Seeds Store
          </h1>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
            Browse live company-sealed products directly available in our Adda Sang Noor Shah, Sahiwal store inventory.
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
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
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
        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-8 h-8 border-4 border-[#00A651] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold text-slate-600">Syncing live inventory from Chaudhary Traders PostgreSQL database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-base">No matching inventory products found</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const itemStock = Number(product.stock !== undefined ? product.stock : product.stock_quantity || 0);
              const itemPrice = Number(product.price !== undefined ? product.price : product.sale_price || 0);
              const isOutOfStock = itemStock <= 0;
              const prodImg = getProductImage(product);

              return (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={prodImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#2A1B69] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow">
                        {product.supplier || 'Sungro Crop Care'}
                      </span>
                      {isOutOfStock ? (
                        <span className="absolute bottom-3 right-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="absolute bottom-3 right-3 bg-[#00A651] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {itemStock} {product.unit || 'Bag'} Available
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        {product.category || 'General'}
                      </span>
                      <h3 className="font-bold text-[#2A1B69] text-sm leading-snug group-hover:text-[#00A651] transition-colors">
                        {product.name}
                      </h3>
                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        {product.batchNo || product.batch_number ? (
                          <p className="text-[11px] font-mono text-slate-600">
                            Batch #: <strong>{product.batchNo || product.batch_number}</strong>
                          </p>
                        ) : null}
                        {product.sku ? (
                          <p className="text-[10px] text-slate-400">SKU Code: {product.sku}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Retail Rate:</span>
                      <span className="font-extrabold text-base text-[#00A651]">
                        Rs. {itemPrice.toLocaleString()}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/923414518001?text=Hello%20Chaudhary%20Traders,%20I%20want%20to%20buy%20or%20inquire%20about:%20${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-extrabold text-xs transition-colors shadow-sm ${
                        isOutOfStock ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#00A651] hover:bg-[#008440]'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Inquire' : 'Order'}</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
