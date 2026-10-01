'use client';

import React from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface CashFlowReportProps {
  startDate: string;
  endDate: string;
  selectedBankId?: string;
}

export function CashFlowReport({ startDate, endDate, selectedBankId }: CashFlowReportProps) {
  const { filterPayablesByPeriod, filterReceivablesByPeriod } = useFinancial();

  const payables = filterPayablesByPeriod(startDate, endDate, selectedBankId);
  const receivables = filterReceivablesByPeriod(startDate, endDate, selectedBankId);

  const totalEntradas = receivables.reduce((sum, item) => sum + item.value, 0);
  const totalSaidas = payables.reduce((sum, item) => sum + (item.paidValue || item.value), 0);
  const saldoProjetado = totalEntradas - totalSaidas;

  // Chart data grouping by Date
  const dateMap: Record<string, { date: string; entradas: number; saidas: number }> = {};

  receivables.forEach((r) => {
    const d = r.receivedDate || r.dueDate || r.createdAt.split('T')[0];
    if (!dateMap[d]) dateMap[d] = { date: d, entradas: 0, saidas: 0 };
    dateMap[d].entradas += r.value;
  });

  payables.forEach((p) => {
    const d = p.paymentDate || p.dueDate || p.createdAt.split('T')[0];
    if (!dateMap[d]) dateMap[d] = { date: d, entradas: 0, saidas: 0 };
    dateMap[d].saidas += p.paidValue || p.value;
  });

  const chartData = Object.values(dateMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      ...item,
      formattedDate: formatDate(item.date),
    }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Entradas */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Previsão / Entradas (Receber)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{formatCurrency(totalEntradas)}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {receivables.length} entrada{receivables.length !== 1 ? 's' : ''} contabilizada{receivables.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Saídas */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Previsão / Despesas (Pagar)
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-400">{formatCurrency(totalSaidas)}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {payables.length} despesa{payables.length !== 1 ? 's' : ''} contabilizada{payables.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Saldo Projetado do Fluxo
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                saldoProjetado >= 0 ? 'bg-sky-500/10 text-sky-400' : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p
            className={`text-2xl font-extrabold ${
              saldoProjetado >= 0 ? 'text-sky-400' : 'text-amber-400'
            }`}
          >
            {formatCurrency(saldoProjetado)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {saldoProjetado >= 0 ? 'Superávit financeiro' : 'Atenção: Déficit projetado'}
          </p>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm print:hidden">
        <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <span>Gráfico Comparativo do Fluxo de Caixa por Data</span>
        </h4>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
            Nenhuma movimentação registrada no período selecionado para exibir o gráfico.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `R$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="entradas" name="Entradas (Receber)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" name="Saídas (Pagar)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Movement List Timeline */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <h4 className="text-sm font-bold text-slate-200 mb-4">Visão Consolidada de Movimentações do Período</h4>
        
        <div className="space-y-2">
          {[...receivables.map((r) => ({ ...r, kind: 'ENTRADA' as const })), ...payables.map((p) => ({ ...p, kind: 'SAIDA' as const }))]
            .sort((a, b) => {
              const dateA = a.kind === 'ENTRADA' ? (a.receivedDate || a.dueDate || '') : (a.paymentDate || a.dueDate || '');
              const dateB = b.kind === 'ENTRADA' ? (b.receivedDate || b.dueDate || '') : (b.paymentDate || b.dueDate || '');
              return dateB.localeCompare(dateA);
            })
            .map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.kind === 'ENTRADA'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {item.kind === 'ENTRADA' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">{item.categoryName}</span>
                    <span className="text-slate-400 text-[11px]">
                      {item.kind === 'ENTRADA'
                        ? `Recebimento • ${formatDate(item.receivedDate || item.dueDate || '')} ${item.supplierName ? `• ${item.supplierName}` : ''}`
                        : `Pagamento • ${formatDate(item.paymentDate || item.dueDate || '')} • ${item.supplierName}`}
                    </span>
                  </div>
                </div>

                <div className="text-right font-bold text-sm">
                  {item.kind === 'ENTRADA' ? (
                    <span className="text-emerald-400">+{formatCurrency(item.value)}</span>
                  ) : (
                    <span className="text-rose-400">-{formatCurrency(item.paidValue || item.value)}</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
