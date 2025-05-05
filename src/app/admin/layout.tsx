'use client';

import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">SECO Admin</h1>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
          <Link href="/admin/content" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Content Management
          </Link>
          <Link href="/admin/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Admin Panel</h2>
            <button className="text-gray-600 hover:text-gray-800">Logout</button>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}