import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

const brands = [
  'Sungro Crop Care Pakistan',
  'Sungro Fertilizers Division',
  'Sungro Crop Protection Sprays',
  'Sungro Hybrid Seeds',
  'Sungro Micronutrients & Foliar',
  'Sungro Plant Protection',
];

export default function BrandsMarquee() {
  return (
    <section id="brands" className="border-y border-slate-200 bg-[#F8FAFC] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#00A651]">
          <Award className="w-3.5 h-3.5" /> Official Exclusive Franchise
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-[#2A1B69] sm:text-4xl">
          Official Sungro Crop Care Partner
        </h2>
        <p className="mt-2 text-xs text-slate-500 max-w-lg mx-auto">
          We deal exclusively in 100% original Sungro company-sealed products with official batch verification.
        </p>
      </div>

      <div className="marquee-container relative mt-8 overflow-hidden">
        {/* Gradient Mask for Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent" />

        <div className="animate-marquee flex w-max items-center gap-6 pr-6">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="flex shrink-0 items-center gap-3.5 rounded-2xl border border-slate-200 bg-white px-7 py-4 shadow-sm transition-all hover:border-[#00A651] hover:shadow-md"
            >
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00A651] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="whitespace-nowrap font-display text-base font-bold text-[#2A1B69]">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
