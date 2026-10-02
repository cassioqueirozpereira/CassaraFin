import Link from 'next/link';
import { ChevronLeft, Lock, Building2 } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#000000] text-neutral-300 font-sans relative flex flex-col items-center justify-start p-6 md:p-12 selection:bg-white/20">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-neutral-900/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-8 mb-8 border-b border-white/[0.05]">
        <Link href="/" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao início</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-semibold text-sm">CassaraFin</span>
        </div>
      </div>

      {/* Content */}
      <main className="w-full max-w-4xl space-y-8 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>Conforme a LGPD (Lei Geral de Proteção de Dados)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-neutral-400 text-sm">
            Entenda como protegemos e tratamos as informações da sua igreja e membros.
          </p>
        </div>

        <div className="space-y-6 text-sm text-neutral-400 leading-relaxed font-light border-t border-white/[0.05] pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">1. Informações Coletadas</h2>
            <p>
              Coletamos apenas as informações estritamente necessárias para a operação da gestão financeira da instituição, incluindo: nome do usuário, e-mail institucional/pessoal, logs de autenticação e movimentações financeiras inseridas pelos tesoureiros.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">2. Uso das Informações</h2>
            <p>
              Os dados coletados são utilizados exclusivamente para: autenticação de usuários, personalização dos relatórios da tesouraria, controle de auditoria de lançamentos e comunicação de suporte técnico.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">3. Armazenamento e Criptografia</h2>
            <p>
              Utilizamos infraestrutura de banco de dados criptografada via PostgreSQL/Supabase, com protocolos de transferência seguros (HTTPS/TLS) e políticas rigorosas de controle de acesso em nível de linha (Row Level Security - RLS).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">4. Não Compartilhamento com Terceiros</h2>
            <p>
              O CassaraFin não comercializa, aluga ou compartilha informações financeiras ou cadastrais da igreja com qualquer empresa de marketing, terceiros ou instituições financeiras não autorizadas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">5. Direitos do Titular dos Dados</h2>
            <p>
              Em conformidade com a LGPD, os administradores da instituição possuem o direito de solicitar a exportação completa, correção ou exclusão definitiva de seus dados da plataforma a qualquer momento.
            </p>
          </section>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex justify-between items-center text-xs text-neutral-500">
          <p>© 2026 CassaraFin. Todos os direitos reservados.</p>
          <Link href="/termos" className="hover:text-white transition-colors">
            Termos de Uso ➔
          </Link>
        </div>
      </main>
    </div>
  );
}
