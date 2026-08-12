import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export default function SiteFooter() {
  return (
    <footer id="contact" className="bg-slate-800 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {/* About Column */}
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-white p-1 shadow-md flex items-center justify-center overflow-hidden">
              <img src={logoImg} alt="Chaudhary Traders Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-display text-xl font-bold">
              Chaudhary <span className="text-[#00A651]">Traders</span>
            </span>
          </Link>
          <p className="mt-4 text-xs leading-relaxed text-slate-300">
            Official exclusive dealer of Sungro Crop Care serving the farmers of Sahiwal since 2009 with 100% original company products, fair prices and honest technical guidance.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://wa.me/923414518001?text=Hello%20Chaudhary%20Traders,%20I%20have%20an%20inquiry%20regarding%20Sungro%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00A651] text-white font-bold text-xs hover:bg-[#008440] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Sungro WhatsApp Advisory</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-white">Quick Links</h3>
          <span className="mt-2 block h-1 w-10 rounded-full bg-[#00A651]" />
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            <li>
              <Link to="/" className="hover:text-[#00A651] transition-colors">Home Page</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#00A651] transition-colors">About Us & Sungro Dealership</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#00A651] transition-colors">All Sungro Products</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#00A651] transition-colors">Contact & Map Location</Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-[#00A651] transition-colors font-bold text-[#00A651]">
                Admin & POS Billing Counter
              </Link>
            </li>
          </ul>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-white">Sungro Product Range</h3>
          <span className="mt-2 block h-1 w-10 rounded-full bg-[#00A651]" />
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            <li>
              <Link to="/products?category=fertilizers" className="hover:text-[#00A651] transition-colors">
                Sungro Fertilizers (DAP, Urea, SOP)
              </Link>
            </li>
            <li>
              <Link to="/products?category=pesticides" className="hover:text-[#00A651] transition-colors">
                Sungro Pesticides & Crop Sprays
              </Link>
            </li>
            <li>
              <Link to="/products?category=seeds" className="hover:text-[#00A651] transition-colors">
                Sungro Hybrid Seed Varieties
              </Link>
            </li>
            <li>
              <Link to="/products?category=micronutrients" className="hover:text-[#00A651] transition-colors">
                Sungro Micronutrients & Foliar Care
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-white">Store Location</h3>
          <span className="mt-2 block h-1 w-10 rounded-full bg-[#00A651]" />
          <ul className="mt-4 space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00A651]" />
              <span>Adda Sang Noor Shah, Sahiwal, Punjab, Pakistan</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-[#00A651]" />
              <a href="tel:+923414518001" className="hover:text-[#00A651] font-bold transition-colors">
                0341 4518001
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[#00A651]" />
              <a href="mailto:info@chaudharytraders.pk" className="hover:text-[#00A651] transition-colors">
                info@chaudharytraders.pk
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-[#00A651]" />
              <span>Open 7 Days: 8:00 AM – 8:00 PM (No Holiday)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-center text-xs text-slate-400 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Chaudhary Traders Sahiwal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Official Exclusive Dealer for Sungro Crop Care</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
