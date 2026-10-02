import Link from 'next/link';
import { ArrowRight, Building2, ChevronRight, BarChart3, ShieldCheck, CreditCard } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 font-sans selection:bg-white/20 relative flex flex-col justify-between overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/4 -right-1/4 w-[700px] h-[700px] bg-neutral-900/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-white font-bold tracking-tight text-lg">CassaraFin</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link href="#recursos" className="hover:text-white transition-colors">Recursos</Link>
          <Link href="#empresa" className="hover:text-white transition-colors">Empresa</Link>
          <Link href="#ajuda" className="hover:text-white transition-colors">Ajuda</Link>
          <Link href="#docs" className="hover:text-white transition-colors">Docs</Link>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-neutral-400 hover:text-white transition-colors hidden sm:block">
            Entrar
          </Link>
          <Link href="/login" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-full transition-all flex items-center gap-2 hover:scale-105">
            Começar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Main Content Container (Fits in standard screen viewports) */}
      <div className="flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto px-6 md:px-12 py-6 md:py-8 space-y-8 md:space-y-12">
        {/* Hero Section */}
        <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Novo módulo de Conciliação OFX
              <ChevronRight className="w-3 h-3 text-emerald-400" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
              Gestão Financeira <br />
              <span className="text-neutral-400">para Igrejas</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed font-light">
              A forma mais simples e segura de gerenciar dízimos, ofertas, contas a pagar e relatórios fiscais. Tudo em tempo real, feito para a tesouraria moderna.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/login" className="w-full sm:w-auto px-6 py-3 bg-white text-black hover:bg-neutral-200 rounded-full font-medium transition-all text-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105">
                Começar agora
              </Link>
              <Link href="#docs" className="w-full sm:w-auto px-6 py-3 bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full font-medium transition-all text-center">
                Documentação
              </Link>
            </div>
          </div>

          {/* Hero Visual / Interactive Card */}
          <div className="relative w-full h-[260px] sm:h-[320px] flex items-center justify-center">
            <div className="relative w-[280px] sm:w-[320px] h-[210px] sm:h-[240px] rotate-[-8deg] hover:rotate-0 hover:scale-105 transition-all duration-500 ease-out group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-800 to-neutral-600 rounded-3xl shadow-2xl opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="absolute inset-3 bg-neutral-900/90 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-emerald-500/30 flex flex-col justify-between p-6 transition-all">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Ao vivo
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-neutral-400 text-xs font-medium">Entradas (Dízimos e Ofertas)</p>
                  <p className="text-3xl text-white font-semibold tracking-tight">R$ 45.290,00</p>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Features Grid (Interactive cards with movement and colorized icons/emojis on hover) */}
        <section id="recursos" className="relative z-10 pt-4 border-t border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Conciliação Bancária */}
            <div className="group relative p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-emerald-500/50 hover:bg-neutral-900/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-neutral-800/90 border border-neutral-700/60 flex items-center justify-center text-neutral-400 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:text-black group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-300 mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors mb-2 flex items-center gap-2">
                Conciliação Bancária
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">💳</span>
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light group-hover:text-neutral-300 transition-colors">
                Importe seus extratos em formato OFX e concilie entradas e saídas automaticamente, economizando horas de trabalho na tesouraria.
              </p>
            </div>
            
            {/* Feature 2: Segurança por Níveis */}
            <div className="group relative p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-blue-500/50 hover:bg-neutral-900/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-neutral-800/90 border border-neutral-700/60 flex items-center justify-center text-neutral-400 group-hover:bg-blue-500 group-hover:border-blue-400 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors mb-2 flex items-center gap-2">
                Segurança por Níveis
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12">🛡️</span>
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light group-hover:text-neutral-300 transition-colors">
                Controle exatamente o que cada membro pode ver. Usuários master gerenciam tudo, enquanto outros níveis visualizam apenas saldos.
              </p>
            </div>

            {/* Feature 3: Relatórios Precisos */}
            <div className="group relative p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-purple-500/50 hover:bg-neutral-900/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-neutral-800/90 border border-neutral-700/60 flex items-center justify-center text-neutral-400 group-hover:bg-purple-500 group-hover:border-purple-400 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-300 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors mb-2 flex items-center gap-2">
                Relatórios Precisos
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">📊</span>
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light group-hover:text-neutral-300 transition-colors">
                Gere balancetes e fluxo de caixa detalhados com poucos cliques. Transparência total para a liderança e para os membros da igreja.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-5 px-6 md:px-12 text-center md:text-left text-neutral-500 text-xs flex flex-col md:flex-row items-center justify-between">
        <p>© 2024 CassaraFin. Todos os direitos reservados.</p>
        <div className="flex gap-6 mt-3 md:mt-0 font-medium">
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          <Link href="#" className="hover:text-white transition-colors">Contato</Link>
        </div>
      </footer>
    </div>
  );
}
