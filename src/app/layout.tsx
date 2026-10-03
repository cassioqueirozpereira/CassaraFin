import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { FinancialProvider } from '@/context/FinancialContext';
import { ToastProvider } from '@/context/ToastContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Sistema de Gestão Financeira | CassaraFin',
  description: 'Sistema completo de gestão financeira e tesouraria: Contas a Pagar, Contas a Receber, Conciliação, Plano de Contas, Fornecedores, Bancos e Relatórios.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-sky-500 selection:text-white">
        <ToastProvider>
          <AuthProvider>
            <FinancialProvider>
              <AppShell>
                {children}
              </AppShell>
            </FinancialProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
