'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowRight, Building2, UserCheck, Eye, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor, informe seu e-mail e senha.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password.trim());
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Credenciais inválidas.');
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-900/30 border border-purple-500/20">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Torre Forte Church
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sistema de Gestão Financeira e Tesouraria
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-200">Acesse sua Conta</h2>
            <p className="text-xs text-slate-400 mt-0.5">Informe seu e-mail e senha de acesso</p>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Endereço de E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@torreforte.org"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 transition-all placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 transition-all placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider text-center">
              Preenchimento Rápido para Testes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('master@torreforte.org', 'masterpassword123')}
                className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 p-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
                title="E-mail: master@torreforte.org | Senha: masterpassword123"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Master</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('plus@torreforte.org', 'pluspassword123')}
                className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-amber-400 p-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
                title="Carrega conta Plus no formulário"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Plus</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('comum@torreforte.org', 'comumpassword123')}
                className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-sky-400 p-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer"
                title="Carrega conta Comum no formulário"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Comum</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-purple-400" />
          <span>Conexão criptografada e segura — CassaraFin</span>
        </p>
      </div>
    </div>
  );
}
