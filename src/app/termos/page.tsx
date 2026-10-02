import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Building2 } from 'lucide-react';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-neutral-300 font-sans relative flex flex-col items-center justify-start p-6 md:p-12 selection:bg-white/20">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neutral-900/30 rounded-full blur-[120px] pointer-events-none" />

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
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Última atualização: Outubro de 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Termos de Uso e Serviço
          </h1>
          <p className="text-neutral-400 text-sm">
            Estes termos regulam a utilização da plataforma de gestão financeira CassaraFin.
          </p>
        </div>

        <div className="space-y-6 text-sm text-neutral-400 leading-relaxed font-light border-t border-white/[0.05] pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar a plataforma CassaraFin, você concorda expressamente em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Caso não concorde com qualquer um destes termos, fica proibida a utilização deste serviço.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">2. Descrição do Serviço</h2>
            <p>
              O CassaraFin é um sistema de gestão financeira e tesouraria voltado para igrejas, organizações religiosas e instituições sem fins lucrativos. O serviço inclui módulos de conciliação bancária, controle de dízimos/ofertas, gestão de contas a pagar/receber e geração de relatórios fiscais.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">3. Responsabilidades da Conta e Níveis de Acesso</h2>
            <p>
              O acesso ao sistema é dividido por níveis de permissão (Master, Plus, Comum). O Usuário Administrador (Master) da instituição é responsável por atribuir, monitorar e revogar permissões de acesso aos membros autorizados.
            </p>
            <p>
              Cada usuário é inteiramente responsável por manter o sigilo de suas credenciais de acesso (e-mail e senha).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">4. Propriedade dos Dados e Sigilo Financeiro</h2>
            <p>
              Todos os dados financeiros, registros de ofertas, membros e extratos inseridos na plataforma pertencem exclusivamente à instituição contratante. O CassaraFin garante que os dados não serão vendidos, compartilhados ou utilizados para fins publicitários.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-medium text-white">5. Modificações nos Termos</h2>
            <p>
              Reservamo-nos o direito de atualizar estes termos periodicamente. Alterações significativas serão notificadas através do sistema ou por e-mail prévio.
            </p>
          </section>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex justify-between items-center text-xs text-neutral-500">
          <p>© 2026 CassaraFin. Todos os direitos reservados.</p>
          <Link href="/privacidade" className="hover:text-white transition-colors">
            Política de Privacidade ➔
          </Link>
        </div>
      </main>
    </div>
  );
}
