'use client';

import React from 'react';
import { RoleSwitcher } from './RoleSwitcher';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

interface HeaderProps {
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export function Header({ isMobileMenuOpen, onToggleMobileMenu }: HeaderProps) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-white print:hidden">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus:outline-none"
            aria-label="Abrir menu de navegação"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <Logo variant="full" size="md" showSubtitle />
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        <RoleSwitcher />

        {currentUser && (
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 pl-2 sm:pl-4 md:pl-6 border-l border-slate-800">
            <div className="hidden md:flex flex-col text-right">
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
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg border border-rose-500/20 transition-all cursor-pointer ml-1 sm:ml-3 md:ml-5 shadow-sm"
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
