'use client';

import React from 'react';
import { RoleSwitcher } from './RoleSwitcher';
import { useFinancial } from '@/context/FinancialContext';
import { Church, RotateCcw } from 'lucide-react';

export function Header() {
  const { resetToDefaultData } = useFinancial();

  const handleReset = () => {
    if (confirm('Deseja restaurar os dados de demonstração originais da Igreja?')) {
      resetToDefaultData();
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between text-white print:hidden">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-900/30 text-white font-bold">
          <Church className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base lg:text-lg font-bold tracking-tight text-slate-100">
            Gestão Financeira Igreja
          </h1>
          <p className="text-xs text-slate-400 font-normal">
            CassaraFin &bull; Módulo Administrativo & Financeiro
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          title="Restaurar dados de demonstração"
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Resetar Dados</span>
        </button>

        <RoleSwitcher />
      </div>
    </header>
  );
}
