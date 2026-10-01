'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFinancial } from '@/context/FinancialContext';
import { AccessDenied } from '@/components/common/AccessDenied';
import { NewCategoryModal } from '@/components/plano-contas/NewCategoryModal';
import { FolderTree, Plus, ArrowUpCircle, ArrowDownCircle, ShieldCheck, CheckCircle } from 'lucide-react';

export default function PlanoContasPage() {
  const { role } = useAuth();
  const { categories } = useFinancial();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Restrito exclusivamente ao Usuário Master
  if (role !== 'master') {
    return <AccessDenied />;
  }

  const entradas = categories.filter((c) => c.type === 'ENTRADA');
  const saidas = categories.filter((c) => c.type === 'SAIDA');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">3. Módulo — Plano de Contas / Cadastro de Lançamentos</h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Gestor Financeiro
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Configuração prévia dos tipos de lançamento para facilitar o preenchimento no Contas a Pagar e Receber
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-sky-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Tipo de Lançamento</span>
        </button>
      </div>

      {/* Info Notice */}
      <div className="bg-sky-950/30 border border-sky-800/40 p-4 rounded-2xl text-xs text-sky-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sky-300">Configuração Simplificada do Plano de Contas</p>
          <p className="text-slate-300">
            Depois de configurado aqui pelo Gestor Financeiro, o usuário que realizar um novo lançamento no Contas a Pagar ou Receber não precisa criar ou digitar manualmente o plano de contas: ele apenas selecionará a opção desejada na listagem pré-configurada.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entradas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ArrowUpCircle className="w-5 h-5" />
              <span>Tipos de Lançamento — Entradas ({entradas.length})</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Receitas
            </span>
          </div>

          <div className="space-y-2">
            {entradas.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {cat.code}
                    </span>
                    <span className="font-bold text-slate-200 text-xs">{cat.name}</span>
                  </div>
                  {cat.description && (
                    <p className="text-[11px] text-slate-400 mt-1">{cat.description}</p>
                  )}
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Saídas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ArrowDownCircle className="w-5 h-5" />
              <span>Tipos de Lançamento — Saídas ({saidas.length})</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Despesas
            </span>
          </div>

          <div className="space-y-2">
            {saidas.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                      {cat.code}
                    </span>
                    <span className="font-bold text-slate-200 text-xs">{cat.name}</span>
                  </div>
                  {cat.description && (
                    <p className="text-[11px] text-slate-400 mt-1">{cat.description}</p>
                  )}
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <NewCategoryModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
    </div>
  );
}
