'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, User } from '@/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  roleLabel: string;
  setRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('master');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('cassarafin_current_user');
      const savedRole = localStorage.getItem('cassarafin_user_role') as UserRole;

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as User;
        setCurrentUser(parsedUser);
        setRoleState(parsedUser.role);
      } else if (savedRole && ['master', 'plus', 'comum'].includes(savedRole)) {
        setRoleState(savedRole);
      }
    } catch (e) {
      console.error('Error loading stored auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Route Guard: Redirect to /login if not logged in (except if already on /login)
  useEffect(() => {
    if (!isLoading) {
      if (!currentUser && pathname !== '/login') {
        router.push('/login');
      } else if (currentUser && pathname === '/login') {
        if (currentUser.role === 'comum') {
          router.push('/relatorios');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [currentUser, isLoading, pathname, router]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (currentUser) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      localStorage.setItem('cassarafin_current_user', JSON.stringify(updatedUser));
    }
    localStorage.setItem('cassarafin_user_role', newRole);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Credenciais inválidas.' };
      }

      const loggedUser: User = data.user;
      setCurrentUser(loggedUser);
      setRoleState(loggedUser.role);

      localStorage.setItem('cassarafin_current_user', JSON.stringify(loggedUser));
      localStorage.setItem('cassarafin_user_role', loggedUser.role);

      if (loggedUser.role === 'comum') {
        router.push('/relatorios');
      } else {
        router.push('/dashboard');
      }

      return { success: true };
    } catch (err) {
      console.error('Erro na chamada de login:', err);
      return { success: false, error: 'Falha na conexão com o servidor de autenticação.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setRoleState('master');
    localStorage.removeItem('cassarafin_current_user');
    localStorage.removeItem('cassarafin_user_role');
    router.push('/login');
  };

  const roleLabelMap: Record<UserRole, string> = {
    master: 'Usuário Master (Acesso Total)',
    plus: 'Usuário Plus (Restrito)',
    comum: 'Usuário Comum (Somente Fluxo de Caixa)',
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        roleLabel: roleLabelMap[role],
        setRole,
        login,
        logout,
        isLoading,
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
