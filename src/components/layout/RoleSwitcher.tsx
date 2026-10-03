'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, UserCheck, Eye } from 'lucide-react';

export function RoleSwitcher() {
  const { role } = useAuth();

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

  const getRoleLabel = () => {
    switch (role) {
      case 'master':
        return 'Usuário Master';
      case 'plus':
        return 'Usuário Plus';
      case 'comum':
        return 'Usuário';
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm select-none">
      {getRoleIcon()}
      <div className="flex flex-col">
        <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Perfil de Acesso</span>
        <span className="text-slate-100 font-semibold text-xs leading-tight">{getRoleLabel()}</span>
      </div>
    </div>
  );
}
