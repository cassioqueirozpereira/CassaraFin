'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Target, ArrowDownCircle, ArrowUpCircle, Wallet, Layers, TrendingDown, PieChart, Users, HeartHandshake, Baby, Building2, Filter } from 'lucide-react';

interface CostCenterReportProps {
  startDate: string;
  endDate: string;
  selectedBankId?: string;
}

export function CostCenterReport({ startDate, endDate, selectedBankId }: CostCenterReportProps) {
  const { costCenters, payables, receivables } = useFinancial();
  const [selectedCcFilter, setSelectedCcFilter] = useState<string>('ALL');

  // Filter items by date range and bank account
  const filteredPayables = payables.filter((item) => {
    const date = item.paymentDate || item.dueDate || item.createdAt.split('T')[0];
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    if (selectedBankId && selectedBankId !== 'ALL' && item.bankAccountId !== selectedBankId) return false;
    if (selectedCcFilter !== 'ALL') {
      if (selectedCcFilter === 'UNASSIGNED') {
        if (item.costCenterId) return false;
      } else if (item.costCenterId !== selectedCcFilter) {
        return false;
      }
    }
    return true;
  });

  const filteredReceivables = receivables.filter((item) => {
    const date = item.receivedDate || item.dueDate || item.createdAt.split('T')[0];
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    if (selectedBankId && selectedBankId !== 'ALL' && item.bankAccountId !== selectedBankId) return false;
    if (selectedCcFilter !== 'ALL') {
      if (selectedCcFilter === 'UNASSIGNED') {
        if (item.costCenterId) return false;
      } else if (item.costCenterId !== selectedCcFilter) {
        return false;
      }
    }
    return true;
  });

  // Calculate total overall expense in filtered period
  const totalPeriodExpenses = filteredPayables.reduce((acc, p) => acc + p.value, 0);
  const totalPeriodIncomes = filteredReceivables.reduce((acc, r) => acc + r.value, 0);

  // Group statistics by Cost Center
  const costCenterStats = costCenters.map((cc) => {
    const ccPayables = payables.filter((p) => {
      const date = p.paymentDate || p.dueDate || p.createdAt.split('T')[0];
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      if (selectedBankId && selectedBankId !== 'ALL' && p.bankAccountId !== selectedBankId) return false;
      return p.costCenterId === cc.id;
    });

    const ccReceivables = receivables.filter((r) => {
      const date = r.receivedDate || r.dueDate || r.createdAt.split('T')[0];
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      if (selectedBankId && selectedBankId !== 'ALL' && r.bankAccountId !== selectedBankId) return false;
      return r.costCenterId === cc.id;
    });

    const totalExpense = ccPayables.reduce((acc, p) => acc + p.value, 0);
    const paidExpense = ccPayables.filter(p => p.status === 'PAGO').reduce((acc, p) => acc + (p.paidValue || p.value), 0);
    const pendingExpense = ccPayables.filter(p => p.status === 'PENDENTE').reduce((acc, p) => acc + p.value, 0);

    const totalIncome = ccReceivables.reduce((acc, r) => acc + r.value, 0);
    const receivedIncome = ccReceivables.filter(r => r.status === 'RECEBIDO').reduce((acc, r) => acc + (r.receivedValue || r.value), 0);

    const percentage = totalPeriodExpenses > 0 ? (totalExpense / totalPeriodExpenses) * 100 : 0;
    const balance = totalIncome - totalExpense;

    return {
      costCenter: cc,
      totalExpense,
      paidExpense,
      pendingExpense,
      totalIncome,
      receivedIncome,
      balance,
      percentage,
      itemCount: ccPayables.length + ccReceivables.length,
      payablesCount: ccPayables.length,
      receivablesCount: ccReceivables.length,
    };
  });

  // Calculate unassigned (Sem Centro de Custo) items
  const unassignedPayables = payables.filter((p) => {
    const date = p.paymentDate || p.dueDate || p.createdAt.split('T')[0];
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    if (selectedBankId && selectedBankId !== 'ALL' && p.bankAccountId !== selectedBankId) return false;
    return !p.costCenterId;
  });

  const unassignedReceivables = receivables.filter((r) => {
    const date = r.receivedDate || r.dueDate || r.createdAt.split('T')[0];
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    if (selectedBankId && selectedBankId !== 'ALL' && r.bankAccountId !== selectedBankId) return false;
    return !r.costCenterId;
  });

  const unassignedExpense = unassignedPayables.reduce((acc, p) => acc + p.value, 0);
  const unassignedIncome = unassignedReceivables.reduce((acc, r) => acc + r.value, 0);

  // Top Spender Cost Center
  const topSpender = [...costCenterStats].sort((a, b) => b.totalExpense - a.totalExpense)[0];

  const getCcIcon = (ccName: string) => {
    const lower = ccName.toLowerCase();
    if (lower.includes('homens')) return <Users className="w-5 h-5 text-sky-400" />;
    if (lower.includes('mulheres')) return <HeartHandshake className="w-5 h-5 text-rose-400" />;
    if (lower.includes('kids') || lower.includes('infantil')) return <Baby className="w-5 h-5 text-amber-400" />;
    return <Building2 className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Filter Options */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Filter className="w-4 h-4 text-purple-400" />
          <span>Filtrar Centro de Custo no Relatório:</span>
        </div>

        <select
          value={selectedCcFilter}
          onChange={(e) => setSelectedCcFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:border-purple-500 cursor-pointer w-full sm:w-72"
        >
          <option value="ALL">Todos os Centros de Custo</option>
          {costCenters.map((cc) => (
            <option key={cc.id} value={cc.id}>
              {cc.code} — {cc.name}
            </option>
          ))}
          <option value="UNASSIGNED">Sem Centro de Custo Vinculado</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gastos */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total de Gastos (Despesas)</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <ArrowDownRightIcon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-100">{formatCurrency(totalPeriodExpenses)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Soma de todas as saídas no período</p>
        </div>

        {/* Maior Gasto */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Maior Gasto do Período</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold text-purple-400 truncate">
            {topSpender && topSpender.totalExpense > 0 ? topSpender.costCenter.name : 'Nenhum'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {topSpender && topSpender.totalExpense > 0
              ? `${formatCurrency(topSpender.totalExpense)} (${topSpender.percentage.toFixed(1)}% do total)`
              : 'Sem despesas registradas'}
          </p>
        </div>

        {/* Total Entradas */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total de Entradas (Receitas)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-100">{formatCurrency(totalPeriodIncomes)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Receitas vinculadas aos centros</p>
        </div>

        {/* Saldo Resultante */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Resultado Líquido do Período</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-xl font-bold ${totalPeriodIncomes - totalPeriodExpenses >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(totalPeriodIncomes - totalPeriodExpenses)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Diferença Entradas - Gastos</p>
        </div>
      </div>

      {/* Visual Breakdown Cards per Cost Center */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-purple-400" />
          <span>Distribuição de Gastos por Centro de Custo</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {costCenterStats.map((stat) => (
            <div key={stat.costCenter.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                    {getCcIcon(stat.costCenter.name)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{stat.costCenter.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{stat.costCenter.code}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-rose-400 block">{formatCurrency(stat.totalExpense)}</span>
                  <span className="text-[10px] text-slate-500">{stat.percentage.toFixed(1)}% dos gastos</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                />
              </div>

              {/* Stats detail grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs border-t border-slate-800/60">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400">Pagas / Baixadas</p>
                  <p className="font-bold text-emerald-400 text-xs mt-0.5">{formatCurrency(stat.paidExpense)}</p>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400">Pendentes</p>
                  <p className="font-bold text-amber-400 text-xs mt-0.5">{formatCurrency(stat.pendingExpense)}</p>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400">Entradas</p>
                  <p className="font-bold text-sky-400 text-xs mt-0.5">{formatCurrency(stat.totalIncome)}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Unassigned Card if any */}
          {(unassignedExpense > 0 || unassignedIncome > 0) && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-300">Sem Centro de Custo</h4>
                    <span className="text-[10px] text-slate-500 font-mono">CC-GERAL</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-rose-400 block">{formatCurrency(unassignedExpense)}</span>
                  <span className="text-[10px] text-slate-500">
                    {totalPeriodExpenses > 0 ? ((unassignedExpense / totalPeriodExpenses) * 100).toFixed(1) : 0}% dos gastos
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-slate-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(totalPeriodExpenses > 0 ? (unassignedExpense / totalPeriodExpenses) * 100 : 0, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs border-t border-slate-800/60">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400">Gastos Não Classificados</p>
                  <p className="font-bold text-rose-400 text-xs mt-0.5">{formatCurrency(unassignedExpense)}</p>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-400">Entradas Não Classificadas</p>
                  <p className="font-bold text-sky-400 text-xs mt-0.5">{formatCurrency(unassignedIncome)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Table by Cost Center */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Resumo Consolidado por Centro de Custo</span>
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Centro de Custo</th>
                  <th className="py-3.5 px-4 text-center">Lançamentos</th>
                  <th className="py-3.5 px-4 text-right">Gastos Totais</th>
                  <th className="py-3.5 px-4 text-right">Gastos Pagos</th>
                  <th className="py-3.5 px-4 text-right">Receitas Totais</th>
                  <th className="py-3.5 px-4 text-right">Saldo Líquido</th>
                  <th className="py-3.5 px-4 text-right">% do Gasto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {costCenterStats.map((stat) => (
                  <tr key={stat.costCenter.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      <div className="flex items-center gap-2">
                        {getCcIcon(stat.costCenter.name)}
                        <div>
                          <span>{stat.costCenter.name}</span>
                          <span className="block text-[10px] text-slate-500 font-mono">{stat.costCenter.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{stat.itemCount}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-400">{formatCurrency(stat.totalExpense)}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-emerald-400">{formatCurrency(stat.paidExpense)}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-sky-400">{formatCurrency(stat.totalIncome)}</td>
                    <td className={`py-3.5 px-4 text-right font-bold ${stat.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatCurrency(stat.balance)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-purple-400 font-bold">
                      {stat.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-950 font-bold border-t border-slate-800 text-slate-200">
                <tr>
                  <td className="py-3.5 px-4 uppercase text-[11px]">Total Geral</td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    {filteredPayables.length + filteredReceivables.length}
                  </td>
                  <td className="py-3.5 px-4 text-right text-rose-400">{formatCurrency(totalPeriodExpenses)}</td>
                  <td className="py-3.5 px-4 text-right text-emerald-400">
                    {formatCurrency(filteredPayables.filter(p => p.status === 'PAGO').reduce((a, b) => a + (b.paidValue || b.value), 0))}
                  </td>
                  <td className="py-3.5 px-4 text-right text-sky-400">{formatCurrency(totalPeriodIncomes)}</td>
                  <td className={`py-3.5 px-4 text-right ${totalPeriodIncomes - totalPeriodExpenses >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(totalPeriodIncomes - totalPeriodExpenses)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-purple-400">100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Transactions List for Selected Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          <span>Detalhamento dos Lançamentos por Centro de Custo</span>
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[900px]">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-3 w-24">Tipo</th>
                  <th className="py-3.5 px-3 w-28">Data</th>
                  <th className="py-3.5 px-3 w-36">Centro de Custo</th>
                  <th className="py-3.5 px-3 w-44">Categoria</th>
                  <th className="py-3.5 px-3 w-52">Fornecedor / Origem</th>
                  <th className="py-3.5 px-3 min-w-[150px]">Observação</th>
                  <th className="py-3.5 px-3 text-right w-32">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPayables.length === 0 && filteredReceivables.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                      Nenhum lançamento encontrado para o filtro selecionado.
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Payables */}
                    {filteredPayables.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 text-[10px]">
                            SAÍDA
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {formatDate(p.paymentDate || p.dueDate)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-medium text-[10px]">
                            {p.costCenterName || 'Geral / Sem CC'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-200">{p.categoryName}</td>
                        <td className="py-3 px-3 text-slate-300 truncate max-w-[180px]">{p.supplierName}</td>
                        <td className="py-3 px-3 text-slate-400 truncate max-w-[200px]">{p.observation}</td>
                        <td className="py-3 px-3 text-right font-bold text-rose-400 whitespace-nowrap">
                          -{formatCurrency(p.value)}
                        </td>
                      </tr>
                    ))}

                    {/* Receivables */}
                    {filteredReceivables.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                            ENTRADA
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {formatDate(r.receivedDate || r.dueDate || '')}
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-medium text-[10px]">
                            {r.costCenterName || 'Geral / Sem CC'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-200">{r.categoryName}</td>
                        <td className="py-3 px-3 text-slate-300 truncate max-w-[180px]">{r.supplierName || 'Membros / Ofertas'}</td>
                        <td className="py-3 px-3 text-slate-400 truncate max-w-[200px]">{r.observation || '-'}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                          +{formatCurrency(r.value)}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowDownRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M7 7l10 10M17 7v10H7" />
    </svg>
  );
}
