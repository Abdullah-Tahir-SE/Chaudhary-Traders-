import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function FloatingWhatsApp() {
  const location = useLocation();

  // Hide floating widget on Admin screens
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <a
      href="https://wa.me/923414518001?text=Hello%20Chaudhary%20Traders,%20I%20want%20to%20buy%20or%20inquire%20about%20crop%20inputs"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 bg-[#00A651] text-white p-3 sm:py-3 sm:px-5 rounded-full shadow-2xl hover:bg-[#008440] hover:scale-105 transition-all duration-300 group border border-white/20 font-sans pointer-events-auto"
      title="Contact Chaudhary Traders Store on WhatsApp"
    >
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>

      <MessageSquare className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />

      <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
        <span className="text-[10px] font-extrabold text-emerald-100 uppercase tracking-widest block">
          Live Store Support
        </span>
        <span className="text-xs font-black tracking-wide">
          Contact WhatsApp
        </span>
      </div>
    </a>
  );
}
