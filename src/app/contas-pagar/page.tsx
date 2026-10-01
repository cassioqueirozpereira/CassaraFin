'use client';

import React, { useState } from 'react';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { PayablesTable } from '@/components/contas-pagar/Table';
import { NewPayableModal } from '@/components/contas-pagar/NewPayableModal';
import { useFinancial } from '@/context/FinancialContext';
import { getStartOfMonthString, getEndOfMonthString } from '@/utils/formatters';
import { Plus, ArrowDownCircle } from 'lucide-react';

export default function ContasPagarPage() {
  const { filterPayablesByPeriod } = useFinancial();

  const [startDate, setStartDate] = useState(getStartOfMonthString());
  const [endDate, setEndDate] = useState(getEndOfMonthString());
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const filteredPayables = filterPayablesByPeriod(startDate, endDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <ArrowDownCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">1. Módulo — Contas a Pagar</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestão de lançamentos de despesas e contas da igreja com fornecedores e notas fiscais
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-rose-600/20 transition-all shrink-0"
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

      {/* Payables List Table */}
      <PayablesTable items={filteredPayables} />

      {/* New Payable Modal */}
      <NewPayableModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
    </div>
  );
}
