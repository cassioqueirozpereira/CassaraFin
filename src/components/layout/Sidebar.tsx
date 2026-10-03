'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/common/Logo';
import {
  LayoutDashboard,
  ArrowUpCircle,
  ArrowDownCircle,
  FolderTree,
  Users,
  BarChart3,
  Lock,
  FileCode,
  Building2,
  FolderPlus,
  ChevronDown,
  Target,
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useAuth();
  const isMaster = role === 'master';
  const isComum = role === 'comum';

  // State for collapsible "Cadastro" dropdown
  const [isCadastroOpen, setIsCadastroOpen] = useState(
    pathname === '/plano-contas' || pathname === '/centro-custo' || pathname === '/fornecedores' || pathname === '/bancos'
  );

  useEffect(() => {
    if (pathname === '/plano-contas' || pathname === '/centro-custo' || pathname === '/fornecedores' || pathname === '/bancos') {
      setIsCadastroOpen(true);
    }
  }, [pathname]);

  const isCadastroActive = pathname === '/plano-contas' || pathname === '/centro-custo' || pathname === '/fornecedores' || pathname === '/bancos';

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-full min-h-[calc(100vh-60px)] print:hidden select-none overflow-y-auto">
      <div className="p-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Módulos do Sistema
          </p>

          <nav className="space-y-1">
            {/* Se for usuário COMUM, libera apenas os Relatórios (Fluxo de Caixa) */}
            {!isComum && (
              <>
                {/* Visão Geral / Dashboard */}
                <Link
                  href="/dashboard"
                  onClick={handleLinkClick}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    pathname === '/dashboard' || pathname === '/'
                      ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    <span>Visão Geral</span>
                  </div>
                </Link>

                {/* 1. Contas a Pagar */}
                <Link
                  href="/contas-pagar"
                  onClick={handleLinkClick}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    pathname === '/contas-pagar'
                      ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ArrowDownCircle className="w-4 h-4 text-rose-400" />
                    <span>Contas a Pagar</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-rose-500/10 text-rose-400 border-rose-500/20">
                    Saídas
                  </span>
                </Link>

                {/* 2. Contas a Receber */}
                <Link
                  href="/contas-receber"
                  onClick={handleLinkClick}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    pathname === '/contas-receber'
                      ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Contas a Receber</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Entradas
                  </span>
                </Link>

                {/* 3. Conciliação */}
                <Link
                  href="/conciliacao"
                  onClick={handleLinkClick}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    pathname === '/conciliacao'
                      ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>Conciliação</span>
                  </div>
                  {!isMaster && (
                    <span className="flex items-center gap-0.5 text-[9px] px-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Leitura
                    </span>
                  )}
                </Link>

                {/* 4. Cadastro (Dropdown Collapsible) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsCadastroOpen(!isCadastroOpen)}
                    className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isCadastroActive
                        ? 'bg-slate-800/90 text-slate-100 font-semibold border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FolderPlus className="w-4 h-4 text-indigo-400" />
                      <span>Cadastro</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isCadastroOpen ? 'transform rotate-180 text-cyan-400' : 'text-slate-500'
                      }`}
                    />
                  </button>

                  {/* Collapsible Submenu */}
                  {isCadastroOpen && (
                    <div className="ml-4 pl-3 border-l border-slate-800 mt-1 space-y-1 animate-in fade-in duration-150">
                      {/* Plano de Contas */}
                      <Link
                        href="/plano-contas"
                        onClick={handleLinkClick}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          pathname === '/plano-contas'
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-cyan-400 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FolderTree className="w-3.5 h-3.5" />
                          <span>Plano de Contas</span>
                        </div>
                        {!isMaster && (
                          <span className="flex items-center gap-0.5 text-[9px] px-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Lock className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </Link>

                      {/* Centro de Custo */}
                      <Link
                        href="/centro-custo"
                        onClick={handleLinkClick}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          pathname === '/centro-custo'
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-cyan-400 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-purple-400" />
                          <span>Centro de Custo</span>
                        </div>
                        {!isMaster && (
                          <span className="flex items-center gap-0.5 text-[9px] px-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Lock className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </Link>

                      {/* Fornecedores */}
                      <Link
                        href="/fornecedores"
                        onClick={handleLinkClick}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          pathname === '/fornecedores'
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-cyan-400 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Fornecedores</span>
                      </Link>

                      {/* Bancos */}
                      <Link
                        href="/bancos"
                        onClick={handleLinkClick}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          pathname === '/bancos'
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-cyan-400 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Bancos</span>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Relatórios (Visível para todos) */}
            <Link
              href="/relatorios"
              onClick={handleLinkClick}
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/relatorios'
                  ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/40 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Relatórios</span>
              </div>
              {isComum && (
                <span className="text-[10px] px-1.5 py-0.5 rounded border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                  Fluxo de Caixa
                </span>
              )}
            </Link>

            {/* Usuários e Níveis de Acesso (Restrito a Master) */}
            {isMaster && (
              <Link
                href="/usuarios"
                onClick={handleLinkClick}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === '/usuarios'
                    ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-400 border border-purple-500/40 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Usuários</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded border bg-purple-500/10 text-purple-400 border-purple-500/20 font-semibold">
                  RBAC
                </span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Footer Branding Badge */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 m-3 rounded-xl">
        <Logo variant="full" size="sm" showSubtitle />
      </div>
    </aside>
  );
}
