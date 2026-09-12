import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLoginModal from '../auth/AdminLoginModal';

export default function TopBar() {
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      setAdminModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-[#1C114C] text-slate-200 text-xs border-b border-white/10 py-2 px-4 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#00A651]" />
              <span>Adda Sang Noor Shah, Sahiwal, Punjab</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
              <Clock className="w-3.5 h-3.5 text-[#00A651]" />
              <span>Open 7 Days: 8:00 AM – 8:00 PM (No Holiday)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+923414518001"
              className="flex items-center gap-1.5 text-white font-bold hover:text-[#00A651] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#00A651]" />
              <span>0341 4518001</span>
            </a>
            <a
              href="https://wa.me/923414518001?text=Hello%20Chaudhary%20Traders,%20I%20have%20an%20inquiry%20regarding%20crop%20inputs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#00A651] font-extrabold hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={handleAdminClick}
              className="px-3 py-1 rounded bg-white/10 hover:bg-[#00A651] text-white font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />
              <span>{isAdmin ? 'Admin Terminal' : 'POS / Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      <AdminLoginModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </>
  );
}
