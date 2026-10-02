import Link from 'next/link';
import { ArrowRight, Building2, ChevronRight, BarChart3, ShieldCheck, CreditCard } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 font-sans selection:bg-white/20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-neutral-900/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-white/[0.05]">
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
          <Link href="/login" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-full transition-all flex items-center gap-2">
            Começar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-medium text-neutral-300 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Novo módulo de Conciliação OFX
            <ChevronRight className="w-3 h-3 text-neutral-500" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white leading-[1.1]">
            Gestão Financeira <br />
            <span className="text-neutral-500">para Igrejas</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 max-w-xl leading-relaxed font-light">
            A forma mais simples e segura de gerenciar dízimos, ofertas, contas a pagar e relatórios fiscais. Tudo em tempo real, feito para a tesouraria moderna.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link href="/login" className="w-full sm:w-auto px-6 py-3 bg-white text-black hover:bg-neutral-200 rounded-full font-medium transition-all text-center">
              Começar agora
            </Link>
            <Link href="#docs" className="w-full sm:w-auto px-6 py-3 bg-transparent hover:bg-white/5 text-white border border-transparent rounded-full font-medium transition-all text-center">
              Documentação
            </Link>
          </div>
        </div>

        {/* Hero Visual / Graphic */}
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
          {/* Abstract glowing cubes representation using CSS */}
          <div className="relative w-[300px] h-[300px] rotate-[-15deg] perspective-[1000px] hover:rotate-[-5deg] transition-all duration-700 ease-out">
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-800 to-neutral-600 rounded-3xl shadow-2xl opacity-50 transform rotate-x-[30deg] rotate-y-[-20deg]" />
            <div className="absolute inset-4 bg-gradient-to-tr from-neutral-900 to-neutral-700 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10 flex flex-col justify-between p-6 transform translate-z-10">
               <div className="flex justify-between items-start">
                 <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                   <BarChart3 className="w-5 h-5 text-white" />
                 </div>
                 <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Ao vivo</span>
               </div>
               <div className="space-y-2">
                 <p className="text-neutral-500 text-sm font-medium">Entradas (Dízimos e Ofertas)</p>
                 <p className="text-3xl text-white font-semibold">R$ 45.290,00</p>
               </div>
               <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                 <div className="w-3/4 h-full bg-white rounded-full" />
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 border-t border-white/[0.05] relative z-10 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-neutral-300" />
              </div>
              <h3 className="text-xl font-medium text-white">Conciliação Bancária</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Importe seus extratos em formato OFX e concilie entradas e saídas automaticamente, economizando horas de trabalho na tesouraria.</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-neutral-300" />
              </div>
              <h3 className="text-xl font-medium text-white">Segurança por Níveis</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Controle exatamente o que cada membro pode ver. Usuários master gerenciam tudo, enquanto outros níveis visualizam apenas saldos.</p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-neutral-300" />
              </div>
              <h3 className="text-xl font-medium text-white">Relatórios Precisos</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Gere balancetes e fluxo de caixa detalhados com poucos cliques. Transparência total para a liderança e para os membros.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-12 px-6 md:px-12 text-center md:text-left text-neutral-500 text-sm flex flex-col md:flex-row items-center justify-between">
        <p>© 2024 CassaraFin. Todos os direitos reservados.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          <Link href="#" className="hover:text-white transition-colors">Contato</Link>
        </div>
      </footer>
    </div>
  );
}
