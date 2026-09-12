import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Lock, CheckCircle2, AlertCircle, Save, KeyRound, LogOut, Eye, EyeOff } from 'lucide-react';
import { updateCustomerProfileApi } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

export default function CustomerProfileModal({ isOpen, onClose }) {
  const { user, token, login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    const res = await updateCustomerProfileApi(token, { name, phone, email, address });
    setSubmitting(false);

    if (res.success && res.user) {
      login(token, res.user);
      setSuccessMsg('Personal information updated successfully.');
    } else {
      setErrorMsg(res.message || 'Failed to update profile.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword) {
      setErrorMsg('Current password is required.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    setSubmitting(true);
    const res = await updateCustomerProfileApi(token, { currentPassword, newPassword });
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMsg(res.message || 'Failed to update password.');
    }
  };

  const handleSignOut = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-fade-in relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#00A651] font-black text-lg flex items-center justify-center border border-emerald-200 shadow-xs">
            {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#2A1B69]">{user.name}</h2>
            <span className="text-xs text-slate-500 font-medium block">
              Farmer Account Profile • Sahiwal
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('info');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'info' ? 'bg-white text-[#2A1B69] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-[#00A651]" />
            <span>Personal Information</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('password');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'password' ? 'bg-white text-[#2A1B69] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#00A651]" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Banners */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#00A651] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00A651]" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Personal Info */}
        {activeTab === 'info' && (
          <form onSubmit={handleInfoSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Full Name / Farmer Name:</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Mobile Phone Number:</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Email Address:</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Address / Village (Chak):</label>
              <div className="relative">
                <input
                  type="text"
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
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Current Password:</label>
              <div className="relative">
                <input
                  required
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-extrabold text-slate-700 mb-1">New Password:</label>
              <div className="relative">
                <input
                  required
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-extrabold text-slate-700 mb-1">Confirm New Password:</label>
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#00A651]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              <KeyRound className="w-4 h-4" />
              <span>{submitting ? 'Updating Password...' : 'Update Account Password'}</span>
            </button>
          </form>
        )}

        {/* Modal Footer Sign Out Option */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Logged in session</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1 text-red-600 font-extrabold hover:underline cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
