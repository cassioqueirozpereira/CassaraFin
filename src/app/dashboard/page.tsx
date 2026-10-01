'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFinancial } from '@/context/FinancialContext';
import { AccessDenied } from '@/components/common/AccessDenied';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  Users,
  FolderTree,
  Plus,
  ArrowRight,
  ShieldCheck,
  FileCode,
} from 'lucide-react';
import Link from 'next/link';
import { NewPayableModal } from '@/components/contas-pagar/NewPayableModal';
import { NewReceivableModal } from '@/components/contas-receber/NewReceivableModal';

export default function DashboardPage() {
  const { role } = useAuth();
  const { payables, receivables, suppliers, categories } = useFinancial();

  const [isNewPayableOpen, setIsNewPayableOpen] = useState(false);
  const [isNewReceivableOpen, setIsNewReceivableOpen] = useState(false);

  // Usuário Comum só tem acesso à visualização do relatório do fluxo de caixa
  if (role === 'comum') {
    return <AccessDenied />;
  }

  const totalEntradas = receivables.reduce((sum, item) => sum + item.value, 0);
  const totalSaidas = payables.reduce((sum, item) => sum + (item.paidValue || item.value), 0);
  const saldoAtual = totalEntradas - totalSaidas;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900/60 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Painel Financeiro Geral
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Gestão Financeira da Igreja
            </h2>
            <p className="text-slate-400 text-xs lg:text-sm mt-1 max-w-xl">
              Controle centralizado de entradas (dízimos e ofertas), saídas (contas a pagar), conciliação bancária OFX e relatórios.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsNewReceivableOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Contas a Receber</span>
            </button>
            <button
              onClick={() => setIsNewPayableOpen(true)}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Contas a Pagar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Entradas */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Entradas
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">{formatCurrency(totalEntradas)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Dízimos, Ofertas e Doações</p>
        </div>

        {/* Saídas */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Saídas
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400">{formatCurrency(totalSaidas)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Contas e Fornecedores</p>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Saldo em Caixa
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p
            className={`text-2xl font-black ${
              saldoAtual >= 0 ? 'text-sky-400' : 'text-amber-400'
            }`}
          >
            {formatCurrency(saldoAtual)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Saldo consolidado</p>
        </div>

        {/* Cadastros */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Fornecedores / Tipos
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-200">{suppliers.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {categories.length} categorias cadastradas
          </p>
        </div>
      </div>

      {/* Quick Access Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          href="/contas-pagar"
          className="group bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-2xl transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
              <ArrowDownCircle className="w-6 h-6" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-semibold">
              Acessar <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Contas a Pagar</h3>
            <p className="text-xs text-slate-400">
              Lançamentos pendentes, parcelamento e baixa manual de despesas.
            </p>
          </div>
        </Link>

        <Link
          href="/contas-receber"
          className="group bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-2xl transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-semibold">
              Acessar <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Contas a Receber</h3>
            <p className="text-xs text-slate-400">
              Lançamentos de dízimos e receitas com baixa manual e parcelas.
            </p>
          </div>
        </Link>

        <Link
          href="/conciliacao"
          className="group bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-2xl transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
              <FileCode className="w-6 h-6" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-semibold">
              Acessar <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Conciliação OFX</h3>
            <p className="text-xs text-slate-400">
              Importação do extrato bancário OFX e confronto de divergências.
            </p>
          </div>
        </Link>

        <Link
          href="/relatorios"
          className="group bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-5 rounded-2xl transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <FolderTree className="w-6 h-6" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 font-semibold">
              Acessar <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Relatórios</h3>
            <p className="text-xs text-slate-400">
              Fluxo de Caixa, filtros por banco e opção de impressão/PDF.
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Últimos Lançamentos Efetuados
          </h3>
          <Link href="/contas-pagar" className="text-xs text-sky-400 hover:underline">
            Ver Todos
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60">
          {[
            ...payables.map((p) => ({ ...p, type: 'SAIDA' as const })),
            ...receivables.map((r) => ({ ...r, type: 'ENTRADA' as const })),
          ]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .slice(0, 5)
            .map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      item.type === 'ENTRADA' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {item.type === 'ENTRADA' ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">{item.categoryName}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.type === 'ENTRADA'
                        ? `${formatDate(item.receivedDate || item.dueDate || '')} ${item.supplierName ? `• ${item.supplierName}` : ''}`
                        : `${formatDate(item.paymentDate || item.dueDate || '')} • ${item.supplierName}`}
                    </p>
                  </div>
                </div>

                <div className="text-right font-bold text-sm">
                  {item.type === 'ENTRADA' ? (
                    <span className="text-emerald-400">+{formatCurrency(item.value)}</span>
                  ) : (
                    <span className="text-rose-400">-{formatCurrency(item.paidValue || item.value)}</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modals */}
      <NewPayableModal isOpen={isNewPayableOpen} onClose={() => setIsNewPayableOpen(false)} />
      <NewReceivableModal isOpen={isNewReceivableOpen} onClose={() => setIsNewReceivableOpen(false)} />
    </div>
  );
}
