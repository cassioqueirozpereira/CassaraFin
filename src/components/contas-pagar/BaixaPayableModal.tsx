'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { useFinancial } from '@/context/FinancialContext';
import { PayableItem } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { AlertCircle, CheckCircle2, Building2, Plus } from 'lucide-react';
import Link from 'next/link';

interface BaixaPayableModalProps {
  payable: PayableItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BaixaPayableModal({ payable, isOpen, onClose }: BaixaPayableModalProps) {
  const { bankAccounts, baixaPayable } = useFinancial();

  const [paidValue, setPaidValue] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (payable) {
      setPaidValue(payable.value.toString());
      setPaymentDate(new Date().toISOString().split('T')[0]);
      if (bankAccounts.length > 0) {
        setBankAccountId(bankAccounts[0].id);
      }
    }
  }, [payable, bankAccounts]);

  if (!payable) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!paidValue || Number(paidValue) <= 0) {
      setErrorMsg('Informe o valor efetivamente pago.');
      return;
    }

    if (!bankAccountId) {
      setErrorMsg('Selecione a conta bancária/caixa de onde o valor foi debitado. Caso não tenha bancos cadastrados, cadastre no menu Cadastro > Bancos.');
      return;
    }

    if (!paymentDate) {
      setErrorMsg('Informe a data do pagamento.');
      return;
    }

    try {
      baixaPayable(payable.id, Number(paidValue), bankAccountId, paymentDate);
      onClose();
    } catch (err) {
      setErrorMsg('Erro ao registrar a baixa manual.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Baixa Manual — Contas a Pagar"
      subtitle={`Efetuar quitação do lançamento de ${payable.categoryName} (${payable.supplierName})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Informações do Lançamento */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
          <p className="text-slate-400">
            <strong>Fornecedor:</strong> {payable.supplierName} ({payable.supplierCpfCnpj})
          </p>
          <p className="text-slate-400">
            <strong>Nº Nota Fiscal:</strong> {payable.invoiceNumber}
          </p>
          <p className="text-slate-400">
            <strong>Vencimento Original:</strong> {formatDate(payable.dueDate)}
          </p>
          <p className="text-slate-200 font-bold text-sm mt-1">
            Valor do Lançamento: {formatCurrency(payable.value)}
          </p>
        </div>

        {/* 1. Banco de Débito */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-300">
              Conta Bancária / Caixa do Débito <span className="text-rose-400">*</span>
            </label>
            {bankAccounts.length === 0 && (
              <Link
                href="/bancos"
                onClick={onClose}
                className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3 h-3" />
                + Cadastrar Banco
              </Link>
            )}
          </div>

          {bankAccounts.length === 0 ? (
            <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 flex items-center justify-between">
              <span>Nenhum banco cadastrado. É necessário incluir um banco primeiro.</span>
              <Link
                href="/bancos"
                onClick={onClose}
                className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px] shrink-0 hover:bg-amber-400 transition-colors"
              >
                Cadastrar Banco
              </Link>
            </div>
          ) : (
            <select
              value={bankAccountId}
              onChange={(e) => setBankAccountId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="">-- Selecione o Banco / Caixa --</option>
              {bankAccounts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.bankName} - Ag {b.agency} C/C {b.accountNumber})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 2. Valor Pago e Data de Pagamento */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Valor Pago (R$) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={paidValue}
              onChange={(e) => setPaidValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500 font-bold text-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Data do Pagamento <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={bankAccounts.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-rose-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Baixa Manual</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
