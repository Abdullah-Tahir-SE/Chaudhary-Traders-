import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import TopBar from '../../components/public/TopBar';
import Navbar from '../../components/public/Navbar';
import SiteFooter from '../../components/public/SiteFooter';

export default function Contact() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', crop: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: '', phone: '', crop: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <TopBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00A651] text-xs font-extrabold uppercase tracking-widest border border-emerald-200">
            <MapPin className="w-3.5 h-3.5" /> Visit Our Sahiwal Store
          </span>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-[#2A1B69]">
            Contact Chaudhary Traders
          </h1>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
            Get technical crop advice, check fertilizer stock availability, or place a bulk farm order directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Store Info */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-extrabold text-[#2A1B69] text-xl border-b pb-3">Store Location & Helpline</h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00A651] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2A1B69] text-sm mb-0.5">Physical Address</h4>
                  <p className="text-slate-600">Adda Sang Noor Shah, Sahiwal, Punjab, Pakistan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2A1B69] text-sm mb-0.5">Phone & WhatsApp</h4>
                  <a href="tel:+923414518001" className="text-[#00A651] font-bold block hover:underline">
                    0341 4518001
                  </a>
                  <span className="text-[10px] text-slate-400">Available 7 days a week for fast response</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#2A1B69] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2A1B69] text-sm mb-0.5">Email Support</h4>
                  <p className="text-slate-600">info@chaudharytraders.pk</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2A1B69] text-sm mb-0.5">Store Opening Hours</h4>
                  <p className="text-slate-600 font-semibold">Open 7 Days a week: 8:00 AM – 8:00 PM</p>
                  <p className="text-[10px] text-[#00A651] font-bold">No Holidays • Open Every Day</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <a
                href="https://wa.me/923414518001?text=Hello%20Chaudhary%20Traders,%20I%20have%20an%20agri%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-[#00A651] text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#008440] transition-colors shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-[#2A1B69] text-xl mb-2">Send Farmer Message</h3>
            <p className="text-xs text-slate-500 mb-6">Leave your details and our agronomy expert will reply promptly.</p>

            {formSent ? (
              <div className="py-12 text-center bg-emerald-50 rounded-2xl border border-emerald-200 p-6 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#00A651] mx-auto mb-3" />
                <h4 className="font-extrabold text-lg text-[#2A1B69]">Thank You for Your Message!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Our Sahiwal store agronomy team will contact you shortly on your provided phone number.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="mt-4 px-6 py-2 rounded-full bg-[#00A651] text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name:</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Chaudhary Muhammad Ali"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F8FAFC] border rounded-xl px-4 py-2.5 outline-none focus:border-[#00A651]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number:</label>
                    <input
                      required
                      type="tel"
                      placeholder="0341 4518001"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F8FAFC] border rounded-xl px-4 py-2.5 outline-none focus:border-[#00A651]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crop Type / Topic:</label>
                  <input
                    type="text"
                    placeholder="e.g. Wheat Fertilizer Dose, Potato Spray"
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    className="w-full bg-[#F8FAFC] border rounded-xl px-4 py-2.5 outline-none focus:border-[#00A651]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message Detail:</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your crop issue, required fertilizer quantity, or general inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F8FAFC] border rounded-xl px-4 py-2.5 outline-none focus:border-[#00A651]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#2A1B69] text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#1C114C] transition-colors shadow-md"
                >
                  <Send className="w-4 h-4 text-[#00A651]" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
