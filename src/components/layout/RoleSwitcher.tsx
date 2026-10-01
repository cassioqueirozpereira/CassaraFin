'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';

export function RoleSwitcher() {
  const { role, setRole, roleLabel } = useAuth();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'gestor':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'admin':
        return <UserCheck className="w-4 h-4 text-amber-400" />;
      case 'operador':
        return <ShieldAlert className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm">
      {getRoleIcon()}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Perfil Atual</span>
        <select
          value={role}
          onChange={handleRoleChange}
          className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer text-xs pr-1"
        >
          <option value="gestor" className="bg-slate-800 text-white">
            Gestor Financeiro (Acesso Total)
          </option>
          <option value="admin" className="bg-slate-800 text-white">
            Administrador (Sem Plano de Contas)
          </option>
          <option value="operador" className="bg-slate-800 text-white">
            Operador (Acesso Básico)
          </option>
        </select>
      </div>
    </div>
  );
}
