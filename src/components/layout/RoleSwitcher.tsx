'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, Eye } from 'lucide-react';

export function RoleSwitcher() {
  const { role, setRole } = useAuth();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'master':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'plus':
        return <UserCheck className="w-4 h-4 text-amber-400" />;
      case 'comum':
        return <Eye className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm">
      {getRoleIcon()}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Perfil de Acesso</span>
        <select
          value={role}
          onChange={handleRoleChange}
          className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer text-xs pr-1"
        >
          <option value="master" className="bg-slate-800 text-white">
            Usuário Master (Acesso Total)
          </option>
          <option value="plus" className="bg-slate-800 text-white">
            Usuário Plus (Lançamentos e Bancos)
          </option>
          <option value="comum" className="bg-slate-800 text-white">
            Usuário Comum (Somente Fluxo de Caixa)
          </option>
        </select>
      </div>
    </div>
  );
}
