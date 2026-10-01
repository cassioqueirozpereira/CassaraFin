'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const isGestor = role === 'gestor';

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

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] print:hidden select-none">
      <div className="p-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Módulos do Sistema
          </p>

          <nav className="space-y-1">
            {/* Visão Geral / Dashboard */}
            <Link
              href="/dashboard"
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/dashboard' || pathname === '/'
                  ? 'bg-sky-600/15 text-sky-400 border border-sky-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Visão Geral</span>
              </div>
            </Link>

            {/* 1. Contas a Pagar */}
            <Link
              href="/contas-pagar"
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/contas-pagar'
                  ? 'bg-sky-600/15 text-sky-400 border border-sky-500/30 font-semibold'
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
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/contas-receber'
                  ? 'bg-sky-600/15 text-sky-400 border border-sky-500/30 font-semibold'
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
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/conciliacao'
                  ? 'bg-sky-600/15 text-sky-400 border border-sky-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>Conciliação</span>
              </div>
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
                    isCadastroOpen ? 'transform rotate-180 text-sky-400' : 'text-slate-500'
                  }`}
                />
              </button>

              {/* Collapsible Submenu */}
              {isCadastroOpen && (
                <div className="ml-4 pl-3 border-l border-slate-800 mt-1 space-y-1 animate-in fade-in duration-150">
                  {/* Plano de Contas */}
                  <Link
                    href="/plano-contas"
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      pathname === '/plano-contas'
                        ? 'bg-sky-600/15 text-sky-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FolderTree className="w-3.5 h-3.5" />
                      <span>Plano de Contas</span>
                    </div>
                    {!isGestor && (
                      <span className="flex items-center gap-0.5 text-[9px] px-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Lock className="w-2 h-2" />
                      </span>
                    )}
                  </Link>

                  {/* Centro de Custo */}
                  <Link
                    href="/centro-custo"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      pathname === '/centro-custo'
                        ? 'bg-sky-600/15 text-sky-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-purple-400" />
                    <span>Centro de Custo</span>
                  </Link>

                  {/* Fornecedores */}
                  <Link
                    href="/fornecedores"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      pathname === '/fornecedores'
                        ? 'bg-sky-600/15 text-sky-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Fornecedores</span>
                  </Link>

                  {/* Bancos */}
                  <Link
                    href="/bancos"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      pathname === '/bancos'
                        ? 'bg-sky-600/15 text-sky-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Bancos</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Relatórios */}
            <Link
              href="/relatorios"
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/relatorios'
                  ? 'bg-sky-600/15 text-sky-400 border border-sky-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Relatórios</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 m-3 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold text-xs">
            IG
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">Igreja Evangélica</p>
            <p className="text-[10px] text-slate-400 truncate">Tesouraria Geral</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
