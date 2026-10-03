'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/common/Logo';
import { Eye, EyeOff, ChevronRight, UserPlus, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, register, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor, informe seu e-mail e senha.');
      return;
    }

    setIsSubmitting(true);
    let result;

    if (mode === 'login') {
      result = await login(email.trim(), password.trim());
    } else {
      result = await register(name.trim(), email.trim(), password.trim());
    }

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Ocorreu um erro ao processar sua solicitação.');
    }
  };

  const handleGoogleClick = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao conectar com Google.');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 font-sans relative flex flex-col items-center justify-center p-6 selection:bg-cyan-500/20 overflow-hidden">
      {/* Background ambient gradient lighting matching Cassara Tech palette */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#00A3FF]/15 via-[#2563EB]/10 to-[#9333EA]/20 rounded-full blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#9333EA]/15 via-[#2563EB]/10 to-[#00A3FF]/20 rounded-full blur-[120px] pointer-events-none opacity-40" />

      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/">
          <Logo variant="full" size="md" showSubtitle />
        </Link>
      </div>

      {/* Top Right Home Link */}
      <div className="absolute top-8 right-8 z-10">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors group font-medium">
          <span>Voltar ao início</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="w-full max-w-[400px] relative z-10 space-y-6 pt-12 md:pt-0">
        {/* Titles */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {mode === 'login' ? 'Acesse sua conta' : 'Criar nova conta'}
          </h1>
        </div>

        {/* Social Auth (Google Login) */}
        <div>
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-white text-sm font-medium py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer hover:border-cyan-500/30"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Entrar com o Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="flex-shrink-0 mx-4 text-xs text-neutral-500">ou</span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
              {errorMsg}
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full bg-[#000000] border border-neutral-800 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 transition-colors placeholder-neutral-600"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full bg-[#000000] border border-neutral-800 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 transition-colors placeholder-neutral-600"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#000000] border border-neutral-800 text-white text-sm rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:border-cyan-500 transition-colors placeholder-neutral-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <p className="text-[11px] text-neutral-500 italic">
              * Por padrão, novas contas são criadas com permissão <b>Comum</b> (somente leitura).
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#00A3FF] via-[#2563EB] to-[#9333EA] hover:opacity-90 text-white font-medium text-sm py-2.5 rounded-lg transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,163,255,0.3)] hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <span>Processando...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Acessar conta</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Criar minha conta</span>
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle (Posicionado abaixo do botão Acessar Conta) */}
        <div className="text-center pt-1">
          <p className="text-sm text-neutral-400">
            {mode === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-all font-medium"
                >
                  Cadastre-se.
                </button>
              </>
            ) : (
              <>
                Já possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-all font-medium"
                >
                  Fazer login.
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-xs text-neutral-600 text-center max-w-[320px] mx-auto leading-relaxed pt-2">
          Ao prosseguir, você concorda com nossos{' '}
          <Link href="/termos" className="underline hover:text-neutral-400">
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link href="/privacidade" className="underline hover:text-neutral-400">
            Política de Privacidade
          </Link>.
        </p>
      </div>
    </div>
  );
}
