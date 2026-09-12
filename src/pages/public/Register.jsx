import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import TopBar from '../../components/public/TopBar';
import Navbar from '../../components/public/Navbar';
import SiteFooter from '../../components/public/SiteFooter';
import { registerApi } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !password || submitting) return;

    setErrorMsg('');
    setSubmitting(true);

    const res = await registerApi({
      name,
      email: email || undefined,
      phone,
      password,
      address: address || undefined,
    });

    setSubmitting(false);

    if (res.success && res.token && res.user) {
      login(res.token, res.user);
      navigate('/', { replace: true });
    } else {
      setErrorMsg(res.message || 'Failed to register account.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <TopBar />
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 my-4 sm:my-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-5 sm:p-8 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <img src={logoImg} alt="Chaudhary Traders Logo" className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 object-contain" />
            <h2 className="text-xl sm:text-2xl font-black text-[#2A1B69] leading-tight">Farmer & Account Registration</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium leading-snug">
              Create your account to order Sungro products & track khata ledger
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
                <label className="block font-extrabold text-slate-700 mb-1">Mobile No.:</label>
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
                <label className="block font-extrabold text-slate-700 mb-1">Email Address (Optional):</label>
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
              <label className="block font-extrabold text-slate-700 mb-1">Password:</label>
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

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
            <span>Already registered? </span>
            <Link to="/login" className="text-[#00A651] font-extrabold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
