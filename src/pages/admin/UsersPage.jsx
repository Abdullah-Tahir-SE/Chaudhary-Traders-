import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserManagement from '../../components/admin/UserManagement';

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl mx-auto">
        <UserManagement />
      </main>
    </div>
  );
}
