'use client';

import React, { useState } from 'react';
import { ReceivableItem } from '@/types';
import { useFinancial } from '@/context/FinancialContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { BaixaReceivableModal } from './BaixaReceivableModal';
import { EditReceivableModal } from './EditReceivableModal';
import { ArrowUpRight, Coins, CheckCircle2, Clock, Trash2, Building2, Pencil, Target } from 'lucide-react';

interface ReceivablesTableProps {
  items: ReceivableItem[];
}

export function ReceivablesTable({ items }: ReceivablesTableProps) {
  const { deleteReceivable } = useFinancial();
  const [selectedReceivableForBaixa, setSelectedReceivableForBaixa] = useState<ReceivableItem | null>(null);
  const [selectedReceivableForEdit, setSelectedReceivableForEdit] = useState<ReceivableItem | null>(null);

  const handleDelete = (id: string, description: string) => {
    if (confirm(`Tem certeza que deseja excluir o lançamento de receita "${description}"?`)) {
      deleteReceivable(id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <Coins className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-300">Nenhum lançamento encontrado</h4>
        <p className="text-slate-500 text-xs mt-1">
          Nenhuma conta a receber registrada para o período selecionado.
        </p>
      </div>
    );
  }

  const totalPrevisto = items.reduce((acc, curr) => acc + curr.value, 0);
  const totalRecebido = items.filter((i) => i.status === 'RECEBIDO').reduce((acc, curr) => acc + (curr.receivedValue || curr.value), 0);

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 min-w-[1000px]">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-3 w-28">Status</th>
                <th className="py-3.5 px-3 w-32">Data Venc. / Rec.</th>
                <th className="py-3.5 px-3 w-40">Tipo Lançamento</th>
                <th className="py-3.5 px-3 w-36">Centro de Custo</th>
                <th className="py-3.5 px-3 w-52">Fornecedor / Doador</th>
                <th className="py-3.5 px-3 text-right w-28">Valor Previsto</th>
                <th className="py-3.5 px-3 text-right w-28">Valor Recebido</th>
                <th className="py-3.5 px-3 w-44">Banco / Caixa</th>
                <th className="py-3.5 px-3 min-w-[180px]">Observação</th>
                <th className="py-3.5 px-3 text-center w-36">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {item.status === 'RECEBIDO' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        RECEBIDO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 text-[10px]">
                        <Clock className="w-3 h-3" />
                        PENDENTE
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-200 whitespace-nowrap">
                    {formatDate(item.receivedDate || item.dueDate || '')}
                    {item.installmentInfo && (
                      <span className="block text-[10px] text-sky-400 font-mono">
                        Parc. {item.installmentInfo.current}/{item.installmentInfo.total}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 text-[11px] truncate max-w-[150px]">
                      <ArrowUpRight className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.categoryName}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {item.costCenterName ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-400 font-medium border border-purple-500/20 text-[11px] truncate max-w-[140px]">
                        <Target className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.costCenterName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[11px]">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    {item.supplierName ? (
                      <span className="font-semibold text-slate-200 truncate max-w-[180px] block" title={item.supplierName}>{item.supplierName}</span>
                    ) : (
                      <span className="text-slate-500 text-[11px] italic">Não informado</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-300 whitespace-nowrap">
                    {formatCurrency(item.value)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold whitespace-nowrap">
                    {item.status === 'RECEBIDO' ? (
                      <span className="text-emerald-400">{formatCurrency(item.receivedValue || item.value)}</span>
                    ) : (
                      <span className="text-slate-500 text-[11px] italic">Aguardando baixa</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 text-[11px]">
                    {item.bankAccountName ? (
                      <span className="inline-flex items-center gap-1 text-slate-300 truncate max-w-[160px]" title={item.bankAccountName}>
                        <Building2 className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate">{item.bankAccountName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 truncate max-w-[200px]" title={item.observation}>
                    {item.observation || '-'}
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {item.status === 'PENDENTE' && (
                        <button
                          onClick={() => setSelectedReceivableForBaixa(item)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Baixar</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedReceivableForEdit(item)}
                        title="Editar Lançamento"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, item.categoryName)}
                        title="Excluir Lançamento"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 text-slate-200 font-bold border-t border-slate-800">
              <tr>
                <td colSpan={4} className="py-3 px-3 text-right uppercase text-[10px] tracking-wider text-slate-400">
                  Totais ({items.length} lançamento{items.length > 1 ? 's' : ''}):
                </td>
                <td className="py-3 px-3 text-right text-slate-200">{formatCurrency(totalPrevisto)}</td>
                <td className="py-3 px-3 text-right text-emerald-400 text-sm">{formatCurrency(totalRecebido)}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <BaixaReceivableModal
        receivable={selectedReceivableForBaixa}
        isOpen={!!selectedReceivableForBaixa}
        onClose={() => setSelectedReceivableForBaixa(null)}
      />

      <EditReceivableModal
        receivable={selectedReceivableForEdit}
        isOpen={!!selectedReceivableForEdit}
        onClose={() => setSelectedReceivableForEdit(null)}
      />
    </>
  );
}
