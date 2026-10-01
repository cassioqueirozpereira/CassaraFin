import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { FinancialProvider } from '@/context/FinancialContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Sistema de Gestão Financeira da Igreja | CassaraFin',
  description: 'Sistema completo de gestão financeira e tesouraria para igrejas: Contas a Pagar, Contas a Receber, Conciliação, Plano de Contas, Fornecedores, Bancos e Relatórios.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-sky-500 selection:text-white">
        <AuthProvider>
          <FinancialProvider>
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-950">
                <div className="w-full max-w-[1800px] mx-auto space-y-6">
                  {children}
                </div>
              </main>
            </div>
          </FinancialProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
