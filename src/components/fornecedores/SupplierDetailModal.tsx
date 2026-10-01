'use client';

import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Supplier } from '@/types';
import { useFinancial } from '@/context/FinancialContext';
import { formatCpfOrCnpj, formatCurrency, formatDate, formatPhone } from '@/utils/formatters';
import { Building2, User, Phone, Mail, FileText } from 'lucide-react';

interface SupplierDetailModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SupplierDetailModal({ supplier, isOpen, onClose }: SupplierDetailModalProps) {
  const { payables } = useFinancial();

  if (!supplier) return null;

  const supplierPayables = payables.filter((p) => p.supplierId === supplier.id);
  const totalPaidToSupplier = supplierPayables.reduce((acc, curr) => acc + (curr.paidValue || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Consulta de Dados do Fornecedor"
      subtitle={`Ficha cadastral completa e histórico financeiro de ${supplier.name}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Header Profile Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              {supplier.personType === 'PJ' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-100">{supplier.name}</h4>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                  Pessoa {supplier.personType === 'PJ' ? 'Jurídica (CNPJ)' : 'Física (CPF)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {supplier.personType === 'PJ' ? 'CNPJ: ' : 'CPF: '}
                {formatCpfOrCnpj(supplier.cpf || supplier.cnpj, supplier.personType)}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-right">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Pago em Lançamentos</p>
            <p className="text-base font-bold text-rose-400">{formatCurrency(totalPaidToSupplier)}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Telefone de Contato</p>
              <p className="font-semibold text-slate-200">{formatPhone(supplier.phone)}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">E-mail de Contato</p>
              <p className="font-semibold text-slate-200">{supplier.email || 'Não cadastrado'}</p>
            </div>
          </div>
        </div>

        {/* Associated Transactions */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Histórico de Lançamentos ({supplierPayables.length})</span>
          </h5>

          {supplierPayables.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center text-slate-500 text-xs">
              Nenhum lançamento vinculado a este fornecedor até o momento.
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Categoria</th>
                    <th className="py-2.5 px-3">Nº NF</th>
                    <th className="py-2.5 px-3 text-right">Valor Pago</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {supplierPayables.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/50">
                      <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{formatDate(item.dueDate)}</td>
                      <td className="py-2.5 px-3 text-slate-200 font-medium">{item.categoryName}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{item.invoiceNumber}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-400">{formatCurrency(item.paidValue || item.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Fechar Consulta
          </button>
        </div>
      </div>
    </Modal>
  );
}
