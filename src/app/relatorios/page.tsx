'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PeriodSelector } from '@/components/common/PeriodSelector';
import { CashFlowReport } from '@/components/relatorios/CashFlowReport';
import { IncomeExpenseReport } from '@/components/relatorios/IncomeExpenseReport';
import { CostCenterReport } from '@/components/relatorios/CostCenterReport';
import { getStartOfMonthString, getEndOfMonthString } from '@/utils/formatters';
import { BarChart3, Activity, PieChart, Printer, Target } from 'lucide-react';

export default function RelatoriosPage() {
  const { role } = useAuth();
  const isComum = role === 'comum';

  const [activeTab, setActiveTab] = useState<'fluxo' | 'entradas_saidas' | 'centro_custo'>('fluxo');
  const [startDate, setStartDate] = useState(getStartOfMonthString());
  const [endDate, setEndDate] = useState(getEndOfMonthString());
  const [selectedBankId, setSelectedBankId] = useState('ALL');

  const handlePrint = () => {
    window.print();
  };

  const currentTab = isComum ? 'fluxo' : activeTab;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm print:border-none print:p-0 print:bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 print:hidden">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 print:text-black">
              5. Módulo — Relatórios Financeiros
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
              {isComum ? 'Visualização de Fluxo de Caixa' : 'Análise de Fluxo de Caixa, Entradas e Saídas e verificação de Gastos por Centro de Custo'}
            </p>
          </div>
        </div>

        {/* Tab Switcher & Print Button */}
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          {!isComum && (
            <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setActiveTab('fluxo')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'fluxo'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Fluxo de Caixa</span>
              </button>

              <button
                onClick={() => setActiveTab('entradas_saidas')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'entradas_saidas'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Entradas e Saídas</span>
              </button>

              <button
                onClick={() => setActiveTab('centro_custo')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'centro_custo'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Centro de Custo</span>
              </button>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 shadow-sm transition-all"
            title="Imprimir ou exportar relatório em PDF"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Period & Bank Filter */}
      <div className="print:hidden">
        <PeriodSelector
          startDate={startDate}
          endDate={endDate}
          selectedBankId={selectedBankId}
          onPeriodChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
          onBankChange={(bankId) => setSelectedBankId(bankId)}
        />
      </div>

      {/* Report View */}
      {activeTab === 'fluxo' && (
        <CashFlowReport startDate={startDate} endDate={endDate} selectedBankId={selectedBankId} />
      )}
      {activeTab === 'entradas_saidas' && (
        <IncomeExpenseReport startDate={startDate} endDate={endDate} selectedBankId={selectedBankId} />
      )}
      {activeTab === 'centro_custo' && (
        <CostCenterReport startDate={startDate} endDate={endDate} selectedBankId={selectedBankId} />
      )}
    </div>
  );
}
