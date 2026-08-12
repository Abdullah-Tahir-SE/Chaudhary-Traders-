import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Lightbulb, ShieldCheck, Sprout, ChevronRight } from 'lucide-react';
import TopBar from '../../components/public/TopBar';
import Navbar from '../../components/public/Navbar';
import SiteFooter from '../../components/public/SiteFooter';

import heroBg from '../../assets/hero-slide-4.jpg';
import tahaffuzImg from '../../assets/tahaffuz-franchise.jpg';
import missionImg from '../../assets/our-mission.jpg';
import visionImg from '../../assets/our-vision.jpg';

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Banner Section */}
        <section className="relative h-[320px] sm:h-[380px] w-full overflow-hidden bg-slate-900 text-white flex items-center justify-center">
          <img
            src={heroBg}
            alt="Spraying Field Background"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-slate-950/70" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              About Us
            </h1>

            {/* Dotted Accent Line */}
            <div className="my-3 flex items-center justify-center gap-1">
              <span className="w-12 h-0.5 bg-[#00A651] rounded-full" />
              <span className="w-1.5 h-1.5 bg-[#00A651] rounded-full" />
            </div>

            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
              <Link to="/" className="hover:text-[#00A651] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-100">About Us</span>
            </nav>
          </div>
        </section>

        {/* 2. Section 1: About Sungro & Chaudhary Traders */}
        <section className="py-16 sm:py-20 px-4 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              About <span className="text-[#00A651]">Sungro & Chaudhary Traders</span>
            </h2>
            {/* Green Accent Line with Dots */}
            <div className="mt-2 flex items-center gap-1">
              <span className="w-2 h-1 bg-[#00A651] rounded-full" />
              <span className="w-2 h-1 bg-[#00A651] rounded-full" />
              <span className="w-2 h-1 bg-[#00A651] rounded-full" />
              <span className="w-20 h-1 bg-[#00A651] rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Tahaffuz Franchise Center Image */}
            <div className="lg:col-span-6 group overflow-hidden rounded-2xl shadow-xl border border-slate-200 bg-slate-100">
              <img
                src={tahaffuzImg}
                alt="Tahaffuz Franchise Store - Chaudhary Traders Sahiwal"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Right: Description Text */}
            <div className="lg:col-span-6 space-y-4 text-sm leading-relaxed text-slate-600 font-medium">
              <p>
                Chaudhary Traders (established in 2009), in official partnership with <strong className="text-slate-900 font-bold">Sungro (PVT) Ltd</strong>, is working for the high yield of crops through providing new technologies and modern farming techniques. We are dealing in the areas of crop protection, seeds, fertilizer, micronutrients, and plant biotechnology. We develop new products and sustainable solutions which help, safeguard, harvests and better yields in order to meet the growing demand for high quality food and feed.
              </p>
              <p>
                We have established a well-managed Franchise Network <strong className="text-[#2A1B69] font-bold">“TAHAFFUZ”</strong> at Adda Sang Noor Shah, Sahiwal. “TAHAFFUZ” is not only selling but also providing complete solutions of farmer problems regarding crop protection. Our field team is providing quality field services to farmers at his door-step.
              </p>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-block px-7 py-3 rounded-full bg-[#00A651] hover:bg-[#008440] text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  GET IN TOUCH
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Section 2: Our Vision & Mission Grid */}
        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                Our Vision & <span className="text-[#00A651]">Mission</span>
              </h2>
              {/* Green Accent Line with Dots */}
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className="w-2 h-1 bg-[#00A651] rounded-full" />
                <span className="w-2 h-1 bg-[#00A651] rounded-full" />
                <span className="w-2 h-1 bg-[#00A651] rounded-full" />
                <span className="w-20 h-1 bg-[#00A651] rounded-full" />
              </div>
            </div>

            {/* Alternating Grid Box */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 grid grid-cols-1 lg:grid-cols-2">
              {/* Row 1, Col 1: Mission Text */}
              <div className="bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                <h3 className="font-extrabold text-2xl sm:text-3xl text-slate-900 mb-4 font-display">
                  Our Mission
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  We combine the power of science and technology with the human element to find out the solutions, which is essential for farm and farmer progress. The company connects the chemistry for sustainability to help and address country's farmer problems for increasing agriculture productivity.
                </p>
              </div>

              {/* Row 1, Col 2: Mission Image */}
              <div className="h-64 lg:h-auto overflow-hidden group">
                <img
                  src={missionImg}
                  alt="Our Mission - Hands holding plant seedling"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Row 2, Col 1: Vision Image */}
              <div className="h-64 lg:h-auto overflow-hidden group order-4 lg:order-3">
                <img
                  src={visionImg}
                  alt="Our Vision - Tractor lens view"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Row 2, Col 2: Vision Text (Dark Navy) */}
              <div className="bg-[#2A1B69] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-3 lg:order-4">
                <h3 className="font-extrabold text-2xl sm:text-3xl text-white mb-4 font-display">
                  Our Vision
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">
                  To be the Pakistan leader in products and services. We will earn our customer’s trust through continuous improvement driven by the integrity and teamwork.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Section 3: Core Values */}
        <section className="py-16 sm:py-24 bg-white px-4 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
              Core <span className="text-[#00A651]">Values</span>
            </h2>
            {/* Green Accent Line with Dots */}
            <div className="mt-2 flex items-center justify-center gap-1">
              <span className="w-2 h-1 bg-[#00A651] rounded-full" />
              <span className="w-2 h-1 bg-[#00A651] rounded-full" />
              <span className="w-2 h-1 bg-[#00A651] rounded-full" />
              <span className="w-20 h-1 bg-[#00A651] rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Value 1: Team Development */}
            <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-[#F8FAFC] hover:shadow-lg hover:bg-white hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00A651] border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#00A651] group-hover:text-white transition-all shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1.5">
                  Team Development
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  We have strong belief on team development. We believe that team can generate difference in the competitive environment.
                </p>
              </div>
            </div>

            {/* Value 2: Innovation */}
            <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-[#F8FAFC] hover:shadow-lg hover:bg-white hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00A651] border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#00A651] group-hover:text-white transition-all shadow-sm">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1.5">
                  Innovation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  We believe in the changing environment, a quick response to changing situations and adaptability, will generate a high value for company in the eye of stakeholders.
                </p>
              </div>
            </div>

            {/* Value 3: Health, Safety and Environment */}
            <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-[#F8FAFC] hover:shadow-lg hover:bg-white hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00A651] border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#00A651] group-hover:text-white transition-all shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1.5">
                  Health, Safety and Environment
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  We as a group have an objective to care the health of our employees, products safe to the environment and we give temptation to our employees to follow the HSE rules.
                </p>
              </div>
            </div>

            {/* Value 4: Value Chain */}
            <div className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-[#F8FAFC] hover:shadow-lg hover:bg-white hover:border-emerald-200 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00A651] border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#00A651] group-hover:text-white transition-all shadow-sm">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#2A1B69] mb-1.5">
                  Value Chain
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Having an excellent corporate image, we are open to dialogue with all the industries, having directly and indirectly contact with agriculture.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
