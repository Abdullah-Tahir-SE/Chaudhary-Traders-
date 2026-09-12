import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, ShieldCheck, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { adminLoginApi } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

export default function AdminLoginModal({ isOpen, onClose }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password || submitting) return;

    setErrorMsg('');
    setSubmitting(true);

    const res = await adminLoginApi({ username_or_email: usernameOrEmail, password });
    setSubmitting(false);

    if (res.success && res.token && res.user) {
      login(res.token, res.user);
      onClose();
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.message || 'Invalid admin credentials.');
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

        <div className="text-center mb-5 sm:mb-6 pr-4 sm:pr-0">
          <img src={logoImg} alt="Chaudhary Traders" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 object-contain" />
          <h2 className="text-lg sm:text-2xl font-black text-[#2A1B69] flex items-center justify-center gap-1.5 flex-wrap leading-tight">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#00A651] shrink-0" />
            <span>Admin Terminal Login</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium leading-snug">
            Authorized Chaudhary Traders Management Access Only
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-extrabold text-slate-700 mb-1">Admin Username / Email:</label>
            <div className="relative">
              <input
                required
                type="text"
                placeholder="Enter Admin Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-extrabold text-slate-700 mb-1">Admin Password:</label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
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

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-extrabold text-xs text-white flex items-center justify-center gap-2 shadow-md transition-all ${
              submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#2A1B69] hover:bg-[#1C114C] cursor-pointer'
            }`}
          >
            <span>{submitting ? 'Verifying Admin Privileges...' : 'Launch Admin Terminal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
