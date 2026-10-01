'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { ReceivablesTable } from '@/components/contas-receber/Table';
import { NewReceivableModal } from '@/components/contas-receber/NewReceivableModal';
import { useFinancial } from '@/context/FinancialContext';
import { AccessDenied } from '@/components/common/AccessDenied';
import { getStartOfMonthString, getEndOfMonthString } from '@/utils/formatters';
import { Plus, ArrowUpCircle } from 'lucide-react';

export default function ContasReceberPage() {
  const { role } = useAuth();
  const { filterReceivablesByPeriod } = useFinancial();

  const [startDate, setStartDate] = useState(getStartOfMonthString());
  const [endDate, setEndDate] = useState(getEndOfMonthString());
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  if (role === 'comum') {
    return <AccessDenied />;
  }

  const filteredReceivables = filterReceivablesByPeriod(startDate, endDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ArrowUpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">2. Módulo — Contas a Receber</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestão de dízimos, ofertas, doações e receitas arrecadadas pela igreja
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Period Filter */}
      <PeriodSelector
        startDate={startDate}
        endDate={endDate}
        onPeriodChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />

      {/* Receivables List Table */}
      <ReceivablesTable items={filteredReceivables} />

      {/* New Receivable Modal */}
      <NewReceivableModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
    </div>
  );
}
