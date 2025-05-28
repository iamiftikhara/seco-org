'use client';

import AdminNav from './components/AdminNav';
import AdminHeader from './components/AdminHeader';
import { theme } from '@/config/theme';
import Image from 'next/image';



export default function AdminLayoutUI({
  children,
}: {
  children: React.ReactNode;
}) {




  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.colors.background.primary }}>
      {/* Sidebar */}
      <div className="w-64" style={{ backgroundColor: theme.colors.primary }}>
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b" style={{ borderColor: `${theme.colors.text.light}20` }}>
          <div className="flex items-center">
            <Image 
              src={theme.organization.logo.default} 
              alt={theme.organization.logoTitle.title.text}
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col ml-2">
              <span className="text-xl font-bold" style={{ color: theme.colors.secondary }}>
                {theme.organization.logoTitle.title.text}
              </span>
              <span className="text-sm" style={{ color: theme.colors.text.light }}>
                Admin Panel
              </span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <AdminNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        {/* Main Content Area */}
        <main 
          className="flex-1 overflow-auto p-6"
          style={{ backgroundColor: theme.colors.background.accent }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}