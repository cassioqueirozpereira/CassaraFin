'use client';

import React from 'react';
import { RoleSwitcher } from './RoleSwitcher';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-8 py-3 flex items-center justify-between text-white print:hidden">
      <div className="flex items-center gap-3">
        <Logo variant="full" size="md" showSubtitle />
      </div>

      <div className="flex items-center gap-3">
        <RoleSwitcher />

        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentUser.email}
              </span>
            </div>

            <button
              onClick={logout}
              title="Encerrar Sessão / Sair"
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
