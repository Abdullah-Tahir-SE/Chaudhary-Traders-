import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/public/Home';
import AboutUs from './pages/public/AboutUs';
import Products from './pages/public/Products';
import Contact from './pages/public/Contact';
import Dashboard from './pages/admin/Dashboard';
import PosPage from './pages/admin/PosPage';
import InventoryPage from './pages/admin/InventoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin / POS Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/pos" element={<PosPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
