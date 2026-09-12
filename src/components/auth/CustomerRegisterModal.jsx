import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Phone, Mail, MapPin, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { customerRegisterApi } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

export default function CustomerRegisterModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !password || submitting) return;

    setErrorMsg('');
    setSubmitting(true);

    const res = await customerRegisterApi({
      name,
      phone,
      email: email || undefined,
      password,
      address: address || undefined,
    });

    setSubmitting(false);

    if (res.success && res.token && res.user) {
      login(res.token, res.user);
      onClose();
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden font-sans">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-5 sm:p-8 animate-fade-in relative overflow-hidden max-h-[92vh] overflow-y-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5 pr-4 sm:pr-0">
          <img src={logoImg} alt="Chaudhary Traders" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 object-contain" />
          <h2 className="text-lg sm:text-2xl font-black text-[#2A1B69] leading-tight">Farmer Registration</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium leading-snug">
            Create account for store orders & khata balance tracking
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-extrabold text-slate-700 mb-1">Full Name / Farmer Name:</label>
            <div className="relative">
              <input
                required
                type="text"
                placeholder="e.g. Chaudhry Tariq Mehmood"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Mobile Phone:</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Email (Optional):</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="farmer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-extrabold text-slate-700 mb-1">Account Password:</label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-extrabold text-slate-700 mb-1">Address / Village (Chak):</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Chak 90/9-L, Adda Sang Noor Shah, Sahiwal"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-extrabold text-xs text-white flex items-center justify-center gap-2 shadow-md transition-all ${
              submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#00A651] hover:bg-[#008440] cursor-pointer'
            }`}
          >
            <span>{submitting ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Modal Footer Login Link */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          <span>Already have a farmer account? </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="text-[#00A651] font-extrabold hover:underline cursor-pointer"
          >
            Sign In / Login Here
          </button>
        </div>
      </div>
    </div>
  );
}
