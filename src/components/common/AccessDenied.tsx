'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';

interface AccessDeniedProps {
  title?: string;
  description?: string;
}

export function AccessDenied({ title, description }: AccessDeniedProps = {}) {
  const { role, setRole, roleLabel } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 shadow-xl shadow-rose-950/20">
        <Lock className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-slate-100 mb-2">
        {title || 'Acesso Restrito ao Módulo'}
      </h2>
      
      <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
        {description || (
          <>
            Seu perfil atual (<span className="text-amber-400 font-medium">{roleLabel}</span>) não possui permissão para acessar este módulo.
          </>
        )}
      </p>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl max-w-md w-full mb-6 text-left space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <ShieldAlert className="w-4 h-4" />
          <span>Níveis de Permissão do Sistema:</span>
        </div>
        <ul className="text-slate-400 list-disc list-inside space-y-1.5 pl-1">
          <li><strong className="text-emerald-400">Usuário Master:</strong> Acesso total a todas as funções e cadastros.</li>
          <li><strong className="text-amber-400">Usuário Plus:</strong> Acesso a lançamentos, fornecedores, bancos e conciliação simples (sem Plano de Contas e Centro de Custo).</li>
          <li><strong className="text-sky-400">Usuário Comum:</strong> Apenas visualização do relatório de Fluxo de Caixa.</li>
        </ul>
      </div>

      <button
        onClick={() => setRole('master')}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
      >
        <span>Alternar para Usuário Master</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
