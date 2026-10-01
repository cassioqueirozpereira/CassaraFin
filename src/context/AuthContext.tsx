'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  roleLabel: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('gestor');

  useEffect(() => {
    const savedRole = localStorage.getItem('cassarafin_user_role') as UserRole;
    if (savedRole && ['gestor', 'admin', 'operador'].includes(savedRole)) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('cassarafin_user_role', newRole);
  };

  const roleLabelMap: Record<UserRole, string> = {
    gestor: 'Gestor Financeiro',
    admin: 'Administrador',
    operador: 'Operador / Membro',
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        roleLabel: roleLabelMap[role],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
