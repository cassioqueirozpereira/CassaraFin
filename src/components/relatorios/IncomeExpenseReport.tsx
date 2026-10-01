'use client';

import React from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

interface IncomeExpenseReportProps {
  startDate: string;
  endDate: string;
  selectedBankId?: string;
}

export function IncomeExpenseReport({ startDate, endDate, selectedBankId }: IncomeExpenseReportProps) {
  const { filterPayablesByPeriod, filterReceivablesByPeriod } = useFinancial();

  const payables = filterPayablesByPeriod(startDate, endDate, selectedBankId);
  const receivables = filterReceivablesByPeriod(startDate, endDate, selectedBankId);

  const totalEntradas = receivables.reduce((sum, item) => sum + item.value, 0);
  const totalSaidas = payables.reduce((sum, item) => sum + (item.paidValue || item.value), 0);
  const saldoFinal = totalEntradas - totalSaidas;

  // Category Breakdown for Entradas
  const categoryIncomeMap: Record<string, { name: string; value: number }> = {};
  receivables.forEach((r) => {
    if (!categoryIncomeMap[r.categoryName]) {
      categoryIncomeMap[r.categoryName] = { name: r.categoryName, value: 0 };
    }
    categoryIncomeMap[r.categoryName].value += r.value;
  });
  const incomePieData = Object.values(categoryIncomeMap);

  // Category Breakdown for Saídas
  const categoryExpenseMap: Record<string, { name: string; value: number }> = {};
  payables.forEach((p) => {
    if (!categoryExpenseMap[p.categoryName]) {
      categoryExpenseMap[p.categoryName] = { name: p.categoryName, value: 0 };
    }
    categoryExpenseMap[p.categoryName].value += p.paidValue || p.value;
  });
  const expensePieData = Object.values(categoryExpenseMap);

  const COLORS_INCOME = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#047857'];
  const COLORS_EXPENSE = ['#f43f5e', '#fb7185', '#e11d48', '#fda4af', '#be123c', '#9f1239'];

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Entradas */}
        <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl shadow-sm bg-gradient-to-b from-emerald-950/20 to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Total de Entradas
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">{formatCurrency(totalEntradas)}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Receitas de Dízimos, Ofertas e Eventos
          </p>
        </div>

        {/* Total Saídas */}
        <div className="bg-slate-900 border border-rose-500/30 p-5 rounded-2xl shadow-sm bg-gradient-to-b from-rose-950/20 to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Total de Saídas
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400">{formatCurrency(totalSaidas)}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Pagamentos de despesas e fornecedores
          </p>
        </div>

        {/* Saldo Final */}
        <div className="bg-slate-900 border border-sky-500/30 p-5 rounded-2xl shadow-sm bg-gradient-to-b from-sky-950/20 to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Resultado / Saldo do Período
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <PieChartIcon className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`text-2xl font-black ${
              saldoFinal >= 0 ? 'text-sky-400' : 'text-amber-400'
            }`}
          >
            {formatCurrency(saldoFinal)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {saldoFinal >= 0 ? 'Resultado Positivo (Superávit)' : 'Déficit no Período'}
          </p>
        </div>
      </div>

      {/* Category Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
        {/* Entradas Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>Distribuição das Entradas por Categoria</span>
          </h4>

          {incomePieData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-slate-500 text-xs">
              Sem entradas no período selecionado.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {incomePieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_INCOME[index % COLORS_INCOME.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Saídas Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
            <span>Distribuição das Saídas por Categoria</span>
          </h4>

          {expensePieData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-slate-500 text-xs">
              Sem saídas no período selecionado.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expensePieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_EXPENSE[index % COLORS_EXPENSE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 shadow-sm">
        <h4 className="text-sm font-bold text-slate-200 mb-4">Relatório Detalhado de Lançamentos</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Categoria / Plano de Contas</th>
                <th className="py-3 px-4">Fornecedor / Origem</th>
                <th className="py-3 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {receivables.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-medium text-slate-200">{formatDate(r.receivedDate || r.dueDate || '')}</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ENTRADA
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{r.categoryName}</td>
                  <td className="py-3 px-4 text-slate-400">{r.supplierName || 'Não especificado'}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">{formatCurrency(r.value)}</td>
                </tr>
              ))}

              {payables.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-medium text-slate-200">{formatDate(p.paymentDate || p.dueDate || '')}</td>
                  <td className="py-3 px-4">
                    <span className="text-rose-400 font-bold text-[10px] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      SAÍDA
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{p.categoryName}</td>
                  <td className="py-3 px-4 text-slate-400">{p.supplierName}</td>
                  <td className="py-3 px-4 text-right font-bold text-rose-400">{formatCurrency(p.paidValue || p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
