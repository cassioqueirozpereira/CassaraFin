'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Rotas que não devem exibir Header e Sidebar (ex: Landing Page, Login, Termos e Privacidade)
  const publicRoutes = ['/', '/login', '/termos', '/privacidade'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <main className="flex-1 w-full h-full min-h-screen bg-[#000000] overflow-y-auto">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-950">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar (hidden on mobile, fixed width on lg+) */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Drawer Overlay & Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 z-10 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area (Full width on mobile, flexible on desktop) */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 w-full">
          <div className="w-full max-w-[1800px] mx-auto space-y-4 sm:space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
