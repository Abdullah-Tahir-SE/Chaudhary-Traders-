import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StockManagement from '../../components/admin/StockManagement';

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <AdminSidebar />
      <main className="flex-1 w-full">
        <StockManagement />
      </main>
    </div>
  );
}
