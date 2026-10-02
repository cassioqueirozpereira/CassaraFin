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
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/', '/login', '/termos', '/privacidade'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('master');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const googleSession = urlParams.get('google_session');

        if (googleSession) {
          try {
            const parsedUser = JSON.parse(decodeURIComponent(googleSession)) as User;
            setCurrentUser(parsedUser);
            setRoleState(parsedUser.role);
            localStorage.setItem('cassarafin_current_user', JSON.stringify(parsedUser));
            localStorage.setItem('cassarafin_user_role', parsedUser.role);

            // Clean query param from URL
            window.history.replaceState({}, document.title, window.location.pathname);

            if (parsedUser.role === 'comum') {
              router.push('/relatorios');
            } else {
              router.push('/dashboard');
            }
            setIsLoading(false);
            return;
          } catch (e) {
            console.error('Erro ao processar sessão Google:', e);
          }
        }
      }

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
  }, [router]);

  // Route Guard: Allow public routes without redirecting to /login
  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      if (!currentUser && !isPublicRoute) {
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

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Erro ao realizar cadastro.' };
      }

      const loggedUser: User = data.user;
      setCurrentUser(loggedUser);
      setRoleState(loggedUser.role);

      localStorage.setItem('cassarafin_current_user', JSON.stringify(loggedUser));
      localStorage.setItem('cassarafin_user_role', loggedUser.role);

      // Default role COMUM goes to /relatorios
      router.push('/relatorios');

      return { success: true };
    } catch (err) {
      console.error('Erro na chamada de cadastro:', err);
      return { success: false, error: 'Falha na conexão ao criar conta.' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Tenta obter a URL de autorização oficial do Google OAuth (com prompt=select_account)
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();

      if (res.ok && data.url) {
        // Redireciona para a página oficial do Google onde o usuário escolhe/digita seu e-mail
        window.location.href = data.url;
        return { success: true };
      }

      // Se ainda não houver GOOGLE_CLIENT_ID no .env.local:
      // Oferece um prompt interativo para o usuário digitar seu e-mail do Google para demonstração imediata
      const userEmail = window.prompt(
        'Integração oficial do Google OAuth pronta!\n\nPara abrir a tela oficial do Google (accounts.google.com), insira o GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local.\n\nEnquanto isso, informe o e-mail Google que deseja usar para testar:'
      );

      if (!userEmail || !userEmail.trim()) {
        return { success: false, error: 'Login via Google cancelado.' };
      }

      const cleanEmail = userEmail.trim().toLowerCase();
      const googleUser: User = {
        id: 'google-user-' + Date.now(),
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'comum',
      };

      setCurrentUser(googleUser);
      setRoleState('comum');
      localStorage.setItem('cassarafin_current_user', JSON.stringify(googleUser));
      localStorage.setItem('cassarafin_user_role', 'comum');

      router.push('/relatorios');
      return { success: true };
    } catch (err) {
      console.error('Erro no login Google:', err);
      return { success: false, error: 'Falha ao conectar com o serviço do Google.' };
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
        register,
        loginWithGoogle,
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
