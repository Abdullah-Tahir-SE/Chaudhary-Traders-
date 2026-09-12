import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#00A651] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-bold text-slate-600">Verifying Chaudhary Traders Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg max-w-md w-full text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-[#2A1B69]">Access Denied</h2>
          <p className="text-xs text-slate-600">
            Admin privileges are required to access POS billing, inventory management, and store statistics.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
}
