import Link from 'next/link';
import { ArrowRight, ChevronRight, BarChart3, ShieldCheck, CreditCard } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export default function Home() {
  return (
    <div className="h-screen max-h-screen overflow-y-auto lg:overflow-hidden bg-[#000000] text-slate-200 font-sans selection:bg-cyan-500/20 relative flex flex-col justify-between">
      {/* Background ambient lighting matching Cassara Tech Palette */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute top-1/4 -right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-[#00A3FF]/15 via-[#2563EB]/10 to-[#9333EA]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#9333EA]/15 via-[#2563EB]/10 to-[#00A3FF]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="z-50 flex items-center justify-between px-6 py-3 md:px-12 backdrop-blur-md border-b border-white/[0.06] shrink-0">
        <Logo variant="full" size="md" showSubtitle />
        
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
          <Link href="/login" className="bg-gradient-to-r from-[#00A3FF] via-[#2563EB] to-[#9333EA] hover:opacity-90 text-white px-5 py-2 rounded-full transition-all flex items-center gap-2 hover:scale-105 shadow-[0_0_20px_rgba(0,163,255,0.3)]">
            Começar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col justify-evenly max-w-7xl w-full mx-auto px-6 md:px-12 py-3 md:py-4 overflow-y-auto lg:overflow-visible">
        {/* Hero Section */}
        <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Novo módulo de Conciliação OFX
              <ChevronRight className="w-3 h-3 text-cyan-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
              Gestão Financeira <br />
              <span className="bg-gradient-to-r from-[#00A3FF] via-[#2563EB] to-[#9333EA] bg-clip-text text-transparent">
                para Igrejas & Organizações
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed font-light">
              A plataforma CassaraFin oferece a forma mais simples e segura de gerenciar dízimos, ofertas, contas a pagar e relatórios fiscais. Tudo em tempo real.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <Link href="/login" className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#00A3FF] via-[#2563EB] to-[#9333EA] hover:opacity-90 text-white rounded-full font-medium transition-all text-center text-sm shadow-[0_0_20px_rgba(0,163,255,0.4)] hover:scale-105">
                Começar agora
              </Link>
              <Link href="#docs" className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-full font-medium transition-all text-center text-sm">
                Documentação
              </Link>
            </div>
          </div>

          {/* Hero Visual / Interactive Card */}
          <div className="relative w-full h-[210px] sm:h-[250px] flex items-center justify-center">
            <div className="relative w-[260px] sm:w-[290px] h-[180px] sm:h-[200px] rotate-[-6deg] hover:rotate-0 hover:scale-105 transition-all duration-500 ease-out group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6C22FF] via-[#0055FF] to-[#00A3FF] rounded-3xl shadow-2xl opacity-40 group-hover:opacity-75 transition-opacity" />
              <div className="absolute inset-3 bg-neutral-900/90 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-cyan-500/40 flex flex-col justify-between p-5 transition-all">
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Ao vivo
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-neutral-400 text-[11px] font-medium">Entradas (Dízimos e Ofertas)</p>
                  <p className="text-2xl sm:text-3xl text-white font-semibold tracking-tight">R$ 45.290,00</p>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-[#00A3FF] via-[#2563EB] to-[#9333EA] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Features Grid */}
        <section id="recursos" className="relative z-10 pt-3 border-t border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1: Conciliação Bancária */}
            <div className="group relative p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-cyan-500/50 hover:bg-neutral-900/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,163,255,0.15)] cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-neutral-800/90 border border-neutral-700/60 flex items-center justify-center text-neutral-400 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(0,163,255,0.6)] transition-all duration-300 mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors mb-1.5 flex items-center gap-2">
                Conciliação Bancária
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">💳</span>
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light group-hover:text-neutral-300 transition-colors">
                Importe seus extratos em formato OFX e concilie entradas e saídas automaticamente, economizando horas de trabalho na tesouraria.
              </p>
            </div>
            
            {/* Feature 2: Segurança por Níveis */}
            <div className="group relative p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-blue-500/50 hover:bg-neutral-900/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)] cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-neutral-800/90 border border-neutral-700/60 flex items-center justify-center text-neutral-400 group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-300 mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors mb-1.5 flex items-center gap-2">
                Segurança por Níveis
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12">🛡️</span>
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light group-hover:text-neutral-300 transition-colors">
                Controle exatamente o que cada membro pode ver. Usuários master gerenciam tudo, enquanto outros níveis visualizam apenas saldos.
              </p>
            </div>

            {/* Feature 3: Relatórios Precisos */}
            <div className="group relative p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-purple-500/50 hover:bg-neutral-900/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(147,51,234,0.15)] cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-neutral-800/90 border border-neutral-700/60 flex items-center justify-center text-neutral-400 group-hover:bg-gradient-to-tr group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(147,51,234,0.6)] transition-all duration-300 mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors mb-1.5 flex items-center gap-2">
                Relatórios Precisos
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">📊</span>
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light group-hover:text-neutral-300 transition-colors">
                Gere balancetes e fluxo de caixa detalhados com poucos cliques. Transparência total para a liderança e para os membros da igreja.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-3 px-6 md:px-12 text-center md:text-left text-neutral-500 text-xs flex flex-col md:flex-row items-center justify-between shrink-0">
        <p>© 2024 Cassara Tech & CassaraFin. Todos os direitos reservados.</p>
        <div className="flex gap-6 mt-2 md:mt-0 font-medium">
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          <Link href="#" className="hover:text-white transition-colors">Contato</Link>
        </div>
      </footer>
    </div>
  );
}
