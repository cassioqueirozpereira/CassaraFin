'use client';

import React, { useState } from 'react';
import { PayableItem } from '@/types';
import { useFinancial } from '@/context/FinancialContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { BaixaPayableModal } from './BaixaPayableModal';
import { EditPayableModal } from './EditPayableModal';
import { FileText, Receipt, ArrowDownRight, CheckCircle2, Clock, Trash2, Building2, Pencil, Target } from 'lucide-react';

interface PayablesTableProps {
  items: PayableItem[];
}

export function PayablesTable({ items }: PayablesTableProps) {
  const { deletePayable } = useFinancial();
  const [selectedPayableForBaixa, setSelectedPayableForBaixa] = useState<PayableItem | null>(null);
  const [selectedPayableForEdit, setSelectedPayableForEdit] = useState<PayableItem | null>(null);

  const handleDelete = (id: string, description: string) => {
    if (confirm(`Tem certeza que deseja excluir o lançamento "${description}"?`)) {
      deletePayable(id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-300">Nenhum lançamento encontrado</h4>
        <p className="text-slate-500 text-xs mt-1">
          Nenhuma conta a pagar registrada para o período selecionado.
        </p>
      </div>
    );
  }

  const totalValor = items.reduce((acc, curr) => acc + curr.value, 0);
  const totalPago = items.filter((i) => i.status === 'PAGO').reduce((acc, curr) => acc + (curr.paidValue || 0), 0);

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 min-w-[1050px]">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-3 w-28">Status</th>
                <th className="py-3.5 px-3 w-28">Data Venc.</th>
                <th className="py-3.5 px-3 w-40">Tipo Lançamento</th>
                <th className="py-3.5 px-3 w-36">Centro de Custo</th>
                <th className="py-3.5 px-3 w-56">Fornecedor</th>
                <th className="py-3.5 px-3 w-32">NF / Cupom</th>
                <th className="py-3.5 px-3 text-right w-28">Valor Orig.</th>
                <th className="py-3.5 px-3 text-right w-28">Valor Pago</th>
                <th className="py-3.5 px-3 w-44">Banco / Caixa</th>
                <th className="py-3.5 px-3 min-w-[180px]">Observação</th>
                <th className="py-3.5 px-3 text-center w-36">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {item.status === 'PAGO' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        PAGO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 text-[10px]">
                        <Clock className="w-3 h-3" />
                        PENDENTE
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-200 whitespace-nowrap">
                    {formatDate(item.dueDate)}
                    {item.installmentInfo && (
                      <span className="block text-[10px] text-sky-400 font-mono">
                        Parc. {item.installmentInfo.current}/{item.installmentInfo.total}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20 text-[11px] truncate max-w-[150px]">
                      <ArrowDownRight className="w-3 h-3 shrink-0" />
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
                    <div className="font-semibold text-slate-100 truncate max-w-[200px]" title={item.supplierName}>{item.supplierName}</div>
                    <div className="text-[10px] text-slate-500">{item.supplierCpfCnpj}</div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-slate-300 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      <FileText className="w-3 h-3 text-sky-400" />
                      {item.invoiceNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-medium text-slate-300 whitespace-nowrap">
                    {formatCurrency(item.value)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold whitespace-nowrap">
                    {item.status === 'PAGO' ? (
                      <span className="text-rose-400">{formatCurrency(item.paidValue || item.value)}</span>
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
                    {item.observation}
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {item.status === 'PENDENTE' && (
                        <button
                          onClick={() => setSelectedPayableForBaixa(item)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Baixar</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedPayableForEdit(item)}
                        title="Editar Lançamento"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, `${item.categoryName} - ${item.supplierName}`)}
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
                <td colSpan={5} className="py-3 px-3 text-right uppercase text-[10px] tracking-wider text-slate-400">
                  Totais ({items.length} lançamento{items.length > 1 ? 's' : ''}):
                </td>
                <td className="py-3 px-3 text-right text-slate-200">{formatCurrency(totalValor)}</td>
                <td className="py-3 px-3 text-right text-rose-400 text-sm">{formatCurrency(totalPago)}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <BaixaPayableModal
        payable={selectedPayableForBaixa}
        isOpen={!!selectedPayableForBaixa}
        onClose={() => setSelectedPayableForBaixa(null)}
      />

      <EditPayableModal
        payable={selectedPayableForEdit}
        isOpen={!!selectedPayableForEdit}
        onClose={() => setSelectedPayableForEdit(null)}
      />
    </>
  );
}
