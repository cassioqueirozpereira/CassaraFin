'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { parseOFX } from '@/utils/ofxParser';
import { OFXTransaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  FileCode,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';

export default function ConciliacaoBancariaPage() {
  const { payables, receivables, bankAccounts, baixaPayable, baixaReceivable } = useFinancial();

  const [selectedBankId, setSelectedBankId] = useState(bankAccounts[0]?.id || '');
  const [ofxTransactions, setOfxTransactions] = useState<OFXTransaction[]>([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseOFX(content);
        reconcileTransactions(parsed);
      }
    };
    reader.readAsText(file);
  };

  const reconcileTransactions = (parsed: OFXTransaction[]) => {
    const reconciled = parsed.map((trx) => {
      if (trx.type === 'DEBIT') {
        // Search in Payables
        const match = payables.find(
          (p) =>
            Math.abs(p.value - trx.amount) < 0.05 ||
            (p.paidValue && Math.abs(p.paidValue - trx.amount) < 0.05)
        );

        if (match) {
          const isExactValue = Math.abs((match.paidValue || match.value) - trx.amount) < 0.01;
          return {
            ...trx,
            reconciliationStatus: match.status === 'PAGO' && isExactValue ? ('CONCILIADO' as const) : ('DIVERGENTE' as const),
            matchedSystemId: match.id,
            matchedSystemType: 'PAYABLE' as const,
            divergenceReason: match.status === 'PENDENTE'
              ? 'Lançamento pendente no sistema (Requer baixa)'
              : !isExactValue
              ? `Divergência: Sistema ${formatCurrency(match.value)} vs OFX ${formatCurrency(trx.amount)}`
              : undefined,
          };
        }
      } else {
        // Search in Receivables
        const match = receivables.find(
          (r) =>
            Math.abs(r.value - trx.amount) < 0.05 ||
            (r.receivedValue && Math.abs(r.receivedValue - trx.amount) < 0.05)
        );

        if (match) {
          const isExactValue = Math.abs((match.receivedValue || match.value) - trx.amount) < 0.01;
          return {
            ...trx,
            reconciliationStatus: match.status === 'RECEBIDO' && isExactValue ? ('CONCILIADO' as const) : ('DIVERGENTE' as const),
            matchedSystemId: match.id,
            matchedSystemType: 'RECEIVABLE' as const,
            divergenceReason: match.status === 'PENDENTE'
              ? 'Receita pendente no sistema (Requer baixa)'
              : !isExactValue
              ? `Divergência: Sistema ${formatCurrency(match.value)} vs OFX ${formatCurrency(trx.amount)}`
              : undefined,
          };
        }
      }

      return {
        ...trx,
        reconciliationStatus: 'NAO_ENCONTRADO' as const,
        divergenceReason: 'Movimentação do extrato não localizada no sistema da igreja',
      };
    });

    setOfxTransactions(reconciled);
  };

  const handleAutoBaixa = (trx: OFXTransaction) => {
    if (!trx.matchedSystemId || !trx.matchedSystemType) return;
    const targetBank = selectedBankId || bankAccounts[0]?.id;

    if (trx.matchedSystemType === 'PAYABLE') {
      baixaPayable(trx.matchedSystemId, trx.amount, targetBank, trx.date);
    } else {
      baixaReceivable(trx.matchedSystemId, trx.amount, targetBank, trx.date);
    }

    // Update state to conciliated
    setOfxTransactions((prev) =>
      prev.map((t) => (t.id === trx.id ? { ...t, reconciliationStatus: 'CONCILIADO', divergenceReason: undefined } : t))
    );
  };

  const totalOfx = ofxTransactions.reduce((acc, curr) => acc + (curr.type === 'CREDIT' ? curr.amount : -curr.amount), 0);
  const conciliadosCount = ofxTransactions.filter((t) => t.reconciliationStatus === 'CONCILIADO').length;
  const divergentesCount = ofxTransactions.filter((t) => t.reconciliationStatus === 'DIVERGENTE').length;
  const naoEncontradosCount = ofxTransactions.filter((t) => t.reconciliationStatus === 'NAO_ENCONTRADO').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Conciliação Bancária OFX</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Importe o arquivo do extrato bancário (.OFX) para confrontar lançamentos e identificar divergências
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBankId}
            onChange={(e) => setSelectedBankId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {bankAccounts.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-slate-900 border border-dashed border-slate-700 hover:border-sky-500/80 rounded-2xl p-8 text-center transition-all">
        <Upload className="w-10 h-10 text-sky-400 mx-auto mb-3" />
        <h4 className="text-sm font-bold text-slate-200">
          {fileName ? `Arquivo Carregado: ${fileName}` : 'Selecione ou arraste o arquivo .OFX do banco'}
        </h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
          Compatível com extratos OFX de qualquer instituição financeira (Itaú, Banco do Brasil, Bradesco, Caixa, Nubank, Inter, Santander, etc.)
        </p>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 cursor-pointer shadow-lg shadow-sky-600/20 transition-all">
          <Upload className="w-4 h-4" />
          <span>{fileName ? 'Trocar Arquivo OFX' : 'Carregar Arquivo OFX'}</span>
          <input type="file" accept=".ofx,.xml" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Summary Metrics */}
      {ofxTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total do Extrato</span>
            <p className="text-xl font-black text-slate-100">{formatCurrency(totalOfx)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{ofxTransactions.length} movimentações</p>
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl bg-emerald-950/10">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Conciliados perfeitamente</span>
            <p className="text-xl font-black text-emerald-400">{conciliadosCount}</p>
            <p className="text-[11px] text-emerald-500/80 mt-0.5">Valores e baixas conferidos</p>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-2xl bg-amber-950/10">
            <span className="text-[10px] uppercase font-bold text-amber-400">Divergências / Pendentes</span>
            <p className="text-xl font-black text-amber-400">{divergentesCount}</p>
            <p className="text-[11px] text-amber-500/80 mt-0.5">Requerem confirmação ou baixa</p>
          </div>

          <div className="bg-slate-900 border border-rose-500/30 p-4 rounded-2xl bg-rose-950/10">
            <span className="text-[10px] uppercase font-bold text-rose-400">Não localizados</span>
            <p className="text-xl font-black text-rose-400">{naoEncontradosCount}</p>
            <p className="text-[11px] text-rose-500/80 mt-0.5">Fora do sistema da igreja</p>
          </div>
        </div>
      )}

      {/* Confrontation Table */}
      {ofxTransactions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Confronto: Extrato Bancário vs Lançamentos do Sistema</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Status Conciliação</th>
                  <th className="py-3 px-4">Data OFX</th>
                  <th className="py-3 px-4">Descrição no Extrato</th>
                  <th className="py-3 px-4 text-right">Valor Extrato</th>
                  <th className="py-3 px-4">Diagnóstico do Sistema</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ofxTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {trx.reconciliationStatus === 'CONCILIADO' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> CONCILIADO
                        </span>
                      )}
                      {trx.reconciliationStatus === 'DIVERGENTE' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 text-[10px]">
                          <AlertTriangle className="w-3 h-3" /> DIVERGÊNCIA
                        </span>
                      )}
                      {trx.reconciliationStatus === 'NAO_ENCONTRADO' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 text-[10px]">
                          <XCircle className="w-3 h-3" /> NÃO ENCONTRADO
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">{formatDate(trx.date)}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{trx.memo}</td>
                    <td className="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                      {trx.type === 'CREDIT' ? (
                        <span className="text-emerald-400 font-mono">+{formatCurrency(trx.amount)}</span>
                      ) : (
                        <span className="text-rose-400 font-mono">-{formatCurrency(trx.amount)}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {trx.divergenceReason || (
                        <span className="text-emerald-400">Lançamento idêntico e baixado no sistema</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {trx.reconciliationStatus === 'DIVERGENTE' && trx.matchedSystemId && (
                        <button
                          onClick={() => handleAutoBaixa(trx)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                        >
                          <RefreshCcw className="w-3 h-3" />
                          <span>Efetuar Baixa Direta</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
