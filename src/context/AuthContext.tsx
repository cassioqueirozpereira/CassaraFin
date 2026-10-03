'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, User } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { redirectToGoogleOAuth } from '@/lib/supabase';

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

function parseHashParams(hash: string): Record<string, string> {
  if (!hash || !hash.startsWith('#')) return {};
  const params: Record<string, string> = {};
  const hashWithoutSymbol = hash.substring(1);
  const pairs = hashWithoutSymbol.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      params[key] = decodeURIComponent(value);
    }
  }
  return params;
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('master');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuthSession = async () => {
      try {
        if (typeof window !== 'undefined') {
          // 1. Processar retorno de autenticação via Supabase OAuth (#access_token=...)
          const hashParams = parseHashParams(window.location.hash);
          if (hashParams.access_token) {
            const payload = parseJwt(hashParams.access_token);
            if (payload && payload.email) {
              const userEmail = payload.email.toLowerCase().trim();
              const userName =
                payload.user_metadata?.full_name ||
                payload.user_metadata?.name ||
                userEmail.split('@')[0];

              // Sincronizar e criar automaticamente na tabela `users` do banco PostgreSQL/Supabase
              try {
                const res = await fetch('/api/auth/sync-user', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: userName, email: userEmail }),
                });

                const data = await res.json();
                if (data.success && data.user) {
                  const googleUser: User = data.user;
                  setCurrentUser(googleUser);
                  setRoleState(googleUser.role);
                  localStorage.setItem('cassarafin_current_user', JSON.stringify(googleUser));
                  localStorage.setItem('cassarafin_user_role', googleUser.role);

                  window.history.replaceState({}, document.title, window.location.pathname);

                  if (googleUser.role === 'comum') {
                    router.push('/relatorios');
                  } else {
                    router.push('/dashboard');
                  }
                  setIsLoading(false);
                  return;
                }
              } catch (err) {
                console.error('Erro ao sincronizar usuário com a tabela users:', err);
              }

              // Fallback se a sincronização com o banco falhar
              const googleUser: User = {
                id: payload.sub || 'google-' + Date.now(),
                name: userName,
                email: userEmail,
                role: 'comum',
              };

              setCurrentUser(googleUser);
              setRoleState('comum');
              localStorage.setItem('cassarafin_current_user', JSON.stringify(googleUser));
              localStorage.setItem('cassarafin_user_role', 'comum');

              window.history.replaceState({}, document.title, window.location.pathname);
              router.push('/relatorios');
              setIsLoading(false);
              return;
            }
          }

          // 2. Processar retorno de sessão via query string (fallback)
          const urlParams = new URLSearchParams(window.location.search);
          const googleSession = urlParams.get('google_session');

          if (googleSession) {
            try {
              const parsedUser = JSON.parse(decodeURIComponent(googleSession)) as User;
              setCurrentUser(parsedUser);
              setRoleState(parsedUser.role);
              localStorage.setItem('cassarafin_current_user', JSON.stringify(parsedUser));
              localStorage.setItem('cassarafin_user_role', parsedUser.role);

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
    };

    initAuthSession();
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

      router.push('/relatorios');

      return { success: true };
    } catch (err) {
      console.error('Erro na chamada de cadastro:', err);
      return { success: false, error: 'Falha na conexão ao criar conta.' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      redirectToGoogleOAuth();
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
