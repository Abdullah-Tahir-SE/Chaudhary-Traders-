import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import catFertilizer from '../../assets/cat-fertilizer.jpg';
import catSpray from '../../assets/cat-spray.jpg';
import catSeeds from '../../assets/cat-seeds.jpg';
import catMicro from '../../assets/cat-micronutrients.jpg';

const categories = [
  {
    id: 'fertilizers',
    image: catFertilizer,
    alt: 'Sungro Fertilizers DAP Urea SOP Khad',
    tag: 'Soil Nutrition',
    title: 'Sungro Fertilizers (Khad & DAP)',
    description: 'Urea, DAP, SOP & NPK blends from Sungro Crop Care for stronger roots and heavier grain yield.',
  },
  {
    id: 'pesticides',
    image: catSpray,
    alt: 'Sungro crop protection spray pesticide fungicide',
    tag: 'Plant Protection',
    title: 'Sungro Crop Sprays (Pesticides)',
    description: 'Insecticides, weedicides, herbicides and fungicides from Sungro for every crop stage.',
  },
  {
    id: 'seeds',
    image: catSeeds,
    alt: 'Sungro hybrid crop seeds wheat maize cotton',
    tag: 'High Germination',
    title: 'Sungro Hybrid Seeds',
    description: 'Certified hybrid wheat, cotton, maize and vegetable seeds from Sungro with 95%+ germination rate.',
  },
  {
    id: 'micronutrients',
    image: catMicro,
    alt: 'Sungro micronutrients plant growth regulators zinc boron',
    tag: 'Crop Health',
    title: 'Sungro Micronutrients & Tonics',
    description: 'Zinc, boron, humic acid, and growth promoters from Sungro that prevent crop deficiencies and boost flowering.',
  },
];

export default function CategoryGrid() {
  return (
    <section id="products" className="bg-[#F8FAFC] py-20 sm:py-24 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#00A651]">
            <Tag className="w-3.5 h-3.5" /> Official Sungro Range
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-[#2A1B69] sm:text-4xl">
            Featured Sungro Product Categories
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Everything your fields need from sowing to harvest — sourced directly from Sungro Crop Care Pakistan.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <article
              key={cat.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[#00A651] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                  {cat.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold text-[#2A1B69] transition-colors group-hover:text-[#00A651]">
                  {cat.title}
                </h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600">{cat.description}</p>
                <Link
                  to={`/products?category=${cat.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full border border-[#00A651] px-4 py-2 text-xs font-bold text-[#00A651] transition-all hover:bg-[#00A651] hover:text-white"
                >
                  <span>Browse Category</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
