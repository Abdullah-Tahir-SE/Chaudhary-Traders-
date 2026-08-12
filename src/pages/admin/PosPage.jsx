import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import PosBilling from '../../components/admin/PosBilling';

export default function PosPage() {
  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 w-full overflow-hidden">
        <PosBilling />
      </main>
    </div>
  );
}
