'use client';

import React from 'react';
import { Filter, Building2 } from 'lucide-react';
import { getStartOfMonthString, getEndOfMonthString } from '@/utils/formatters';
import { useFinancial } from '@/context/FinancialContext';

interface PeriodSelectorProps {
  startDate: string;
  endDate: string;
  selectedBankId?: string;
  onPeriodChange: (start: string, end: string) => void;
  onBankChange?: (bankId: string) => void;
}

export function PeriodSelector({
  startDate,
  endDate,
  selectedBankId = 'ALL',
  onPeriodChange,
  onBankChange,
}: PeriodSelectorProps) {
  const { bankAccounts } = useFinancial();

  const handleQuickPreset = (preset: 'this_month' | 'last_month' | 'this_year' | 'all') => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;

    if (preset === 'this_month') {
      onPeriodChange(getStartOfMonthString(), getEndOfMonthString());
    } else if (preset === 'last_month') {
      const prevMonth = mm === 1 ? 12 : mm - 1;
      const prevYear = mm === 1 ? yyyy - 1 : yyyy;
      const lastDay = new Date(prevYear, prevMonth, 0).getDate();
      const mmStr = String(prevMonth).padStart(2, '0');
      const ddStr = String(lastDay).padStart(2, '0');
      onPeriodChange(`${prevYear}-${mmStr}-01`, `${prevYear}-${mmStr}-${ddStr}`);
    } else if (preset === 'this_year') {
      onPeriodChange(`${yyyy}-01-01`, `${yyyy}-12-31`);
    } else if (preset === 'all') {
      onPeriodChange('', '');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
          <Filter className="w-4 h-4 text-sky-400" />
          <span>Filtrar Período:</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onPeriodChange(e.target.value, endDate)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
          />
          <span className="text-slate-500 text-xs font-medium">até</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onPeriodChange(startDate, e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => handleQuickPreset('this_month')}
            className="text-xs bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap"
          >
            Este Mês
          </button>
          <button
            onClick={() => handleQuickPreset('last_month')}
            className="text-xs bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap"
          >
            Mês Anterior
          </button>
          <button
            onClick={() => handleQuickPreset('this_year')}
            className="text-xs bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap"
          >
            Este Ano
          </button>
          <button
            onClick={() => handleQuickPreset('all')}
            className="text-xs bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap"
          >
            Todos
          </button>
        </div>
      </div>

      {/* Bank Account Filter */}
      {onBankChange && (
        <div className="flex items-center gap-2 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
          <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Banco:</span>
          <select
            value={selectedBankId}
            onChange={(e) => onBankChange(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="ALL">Todos os Bancos / Caixas</option>
            {bankAccounts.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
