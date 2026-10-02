'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas que não devem exibir Header e Sidebar (ex: Landing Page, Login, Termos e Privacidade)
  const publicRoutes = ['/', '/login', '/termos', '/privacidade'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <main className="flex-1 w-full h-full min-h-screen bg-[#000000] overflow-y-auto">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <div className="flex flex-1 overflow-hidden bg-slate-950">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="w-full max-w-[1800px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
