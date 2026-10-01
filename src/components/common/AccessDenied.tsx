'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';

export function AccessDenied() {
  const { role, setRole, roleLabel } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-xl shadow-rose-950/20">
        <Lock className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-slate-100 mb-2">Acesso Restrito ao Plano de Contas</h2>
      
      <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
        Este módulo é de acesso exclusivo para o <strong className="text-slate-200">Gestor Financeiro</strong>. 
        Seu perfil atual (<span className="text-amber-400 font-medium">{roleLabel}</span>) não possui permissão para cadastrar ou alterar a estrutura do plano de contas.
      </p>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl max-w-md w-full mb-6 text-left space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <ShieldAlert className="w-4 h-4" />
          <span>Regras de Permissão do Sistema:</span>
        </div>
        <ul className="text-slate-400 list-disc list-inside space-y-1 pl-1">
          <li><strong className="text-emerald-400">Gestor Financeiro:</strong> Acesso total ao plano de contas.</li>
          <li><strong className="text-slate-300">Administrador:</strong> Sem acesso ao cadastro do plano de contas.</li>
          <li><strong className="text-slate-300">Outros Usuários:</strong> Acesso bloqueado.</li>
        </ul>
      </div>

      <button
        onClick={() => setRole('gestor')}
        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-sky-600/25 transition-all"
      >
        <span>Alternar para Gestor Financeiro</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
