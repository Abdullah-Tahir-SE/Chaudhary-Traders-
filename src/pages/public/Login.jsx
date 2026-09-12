import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import TopBar from '../../components/public/TopBar';
import Navbar from '../../components/public/Navbar';
import SiteFooter from '../../components/public/SiteFooter';
import { loginApi } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password || submitting) return;

    setErrorMsg('');
    setSubmitting(true);

    const res = await loginApi({ emailOrPhone, password });
    setSubmitting(false);

    if (res.success && res.token && res.user) {
      login(res.token, res.user);
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      setErrorMsg(res.message || 'Invalid username, phone/email or password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <TopBar />
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 my-4 sm:my-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-5 sm:p-8 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <img src={logoImg} alt="Chaudhary Traders Logo" className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 object-contain" />
            <h2 className="text-xl sm:text-2xl font-black text-[#2A1B69] leading-tight">Sign In to Account</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium leading-snug">
              Chaudhary Traders POS & Customer Portal
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Username / Email / Phone:</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="Enter Username, Email or Phone"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Account Password:</label>
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
                submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#00A651] hover:bg-[#008440] cursor-pointer'
              }`}
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
            <span>Don't have a farmer account yet? </span>
            <Link to="/register" className="text-[#00A651] font-extrabold hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
