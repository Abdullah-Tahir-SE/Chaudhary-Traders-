import React from 'react';
import { Link } from 'react-router-dom';
import wheatField from '../../assets/hero-slide-3.jpg';
import { ShieldCheck, Award, Users, Sprout } from 'lucide-react';

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* Background Golden Wheat Framing Images (Left & Right) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-36 sm:w-60 lg:w-80 opacity-20" aria-hidden="true">
        <img
          src={wheatField}
          alt=""
          className="h-full w-full object-cover object-left [mask-image:linear-gradient(to_right,black_35%,transparent)]"
        />
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 w-36 sm:w-60 lg:w-80 opacity-20" aria-hidden="true">
        <img
          src={wheatField}
          alt=""
          className="h-full w-full object-cover object-right [mask-image:linear-gradient(to_left,black_35%,transparent)]"
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-[#00A651] text-xs font-extrabold uppercase tracking-widest border border-emerald-200">
          <Sprout className="w-3.5 h-3.5" /> What We Do
        </div>

        <h2 className="mt-6 max-w-3xl mx-auto font-display text-3xl sm:text-4xl font-extrabold text-[#2A1B69] leading-tight">
          Chaudhary Traders Empowers Sahiwal Farmers With Premium Inputs & Agronomy Advice
        </h2>

        <p className="mt-5 max-w-2xl mx-auto text-slate-600 text-base leading-relaxed">
          We bring 15+ years of agricultural retail excellence (serving Sahiwal farmers since 2009). As the official exclusive dealer of Sungro Crop Care, we ensure 100% genuine crop care solutions tailored to local soil conditions.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#2A1B69] text-[#00A651] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#2A1B69] mb-2">100% Genuine Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct distribution of authentic Sungro fertilizers (DAP, Urea, SOP) and registered pesticides with original company seals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#2A1B69] text-[#00A651] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#2A1B69] mb-2">Authorized Dealership</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official exclusive dealership of Sungro Crop Care Pakistan in Sahiwal region.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#2A1B69] text-[#00A651] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#2A1B69] mb-2">Expert Advisory</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Free technical field guidance, pest management diagnosis, and custom spray scheduling for high yield harvest.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full bg-[#00A651] px-8 py-3.5 text-sm font-extrabold text-white shadow-lg hover:bg-[#008440] transition-all hover:scale-105"
          >
            LEARN MORE ABOUT US
          </Link>
        </div>
      </div>
    </section>
  );
}
