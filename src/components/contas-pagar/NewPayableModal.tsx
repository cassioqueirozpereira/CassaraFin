'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { QuickSupplierModal } from '@/components/common/QuickSupplierModal';
import { useFinancial } from '@/context/FinancialContext';
import { Supplier } from '@/types';
import { formatCpfOrCnpj, formatCurrency } from '@/utils/formatters';
import { AlertCircle, Plus, Search, CheckCircle2, UserCheck, Layers, Building2 } from 'lucide-react';
import Link from 'next/link';

interface NewPayableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewPayableModal({ isOpen, onClose }: NewPayableModalProps) {
  const { categories, costCenters, suppliers, bankAccounts, addPayable } = useFinancial();

  const [categoryId, setCategoryId] = useState('');
  const [costCenterId, setCostCenterId] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [isQuickSupplierOpen, setIsQuickSupplierOpen] = useState(false);

  const [value, setValue] = useState('');
  const [invoiceValue, setInvoiceValue] = useState('');
  const [observation, setObservation] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bankAccountId, setBankAccountId] = useState('');
  const [installmentsCount, setInstallmentsCount] = useState(1);

  const [errorMsg, setErrorMsg] = useState('');

  const expenseCategories = categories.filter((c) => c.type === 'SAIDA' && c.isActive);

  const filteredSuppliers = suppliers.filter((sup) => {
    if (!supplierSearchQuery) return true;
    const term = supplierSearchQuery.toLowerCase();
    const doc = (sup.cpf || sup.cnpj || '').replace(/\D/g, '');
    const cleanQuery = term.replace(/\D/g, '');
    return (
      sup.name.toLowerCase().includes(term) ||
      (cleanQuery && doc.includes(cleanQuery))
    );
  });

  const resetForm = () => {
    setCategoryId('');
    setCostCenterId('');
    setSelectedSupplier(null);
    setSupplierSearchQuery('');
    setValue('');
    setInvoiceValue('');
    setObservation('');
    setInvoiceNumber('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setBankAccountId('');
    setInstallmentsCount(1);
    setErrorMsg('');
  };

  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierSearchQuery(supplier.name);
    setShowSupplierDropdown(false);
  };

  const handleQuickSupplierCreated = (newSupplier: Supplier) => {
    setSelectedSupplier(newSupplier);
    setSupplierSearchQuery(newSupplier.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!categoryId) {
      setErrorMsg('Por favor, selecione o Tipo de Lançamento (Plano de Contas).');
      return;
    }
    if (!selectedSupplier) {
      setErrorMsg('O Fornecedor é obrigatório. Selecione um fornecedor existente ou realize o cadastro.');
      return;
    }
    if (!value || Number(value) <= 0) {
      setErrorMsg('O Valor do lançamento é obrigatório e deve ser maior que zero.');
      return;
    }
    if (!invoiceValue || Number(invoiceValue) <= 0) {
      setErrorMsg('O Valor da nota fiscal é obrigatório.');
      return;
    }
    if (!observation.trim()) {
      setErrorMsg('A Observação é obrigatória e de preenchimento livre.');
      return;
    }
    if (!invoiceNumber.trim()) {
      setErrorMsg('O campo Nota fiscal / Cupom fiscal é obrigatório.');
      return;
    }

    try {
      const bank = bankAccounts.find((b) => b.id === bankAccountId);

      addPayable({
        categoryId,
        costCenterId: costCenterId || undefined,
        supplierId: selectedSupplier.id,
        value: Number(value),
        invoiceValue: Number(invoiceValue),
        observation: observation.trim(),
        invoiceNumber: invoiceNumber.trim(),
        dueDate,
        installmentsCount,
      });

      // If bank was selected for cash flow forecast, attach to generated items
      if (bankAccountId && bank) {
        // Handled by context or state update
      }

      resetForm();
      onClose();
    } catch (err) {
      setErrorMsg('Ocorreu um erro ao salvar o lançamento.');
    }
  };

  const installmentValuePreview = value && Number(value) > 0 && installmentsCount > 1
    ? (Number(value) / installmentsCount)
    : null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetForm();
          onClose();
        }}
        title="Novo Lançamento — Contas a Pagar"
        subtitle="O lançamento será registrado com status Pendente até ser efetuada a Baixa Manual"
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Tipo de Lançamento & Centro de Custo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tipo de Lançamento (Plano de Contas) <span className="text-rose-400">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="">-- Selecione o Tipo de Despesa --</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.code} - {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Centro de Custo
              </label>
              <select
                value={costCenterId}
                onChange={(e) => setCostCenterId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="">-- Selecione o Centro de Custo --</option>
                {costCenters.filter(cc => cc.isActive).map((cc) => (
                  <option key={cc.id} value={cc.id}>
                    {cc.code} - {cc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Fornecedor com busca por CNPJ, CPF, Nome */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Fornecedor <span className="text-rose-400">* (Busca por Nome, CPF ou CNPJ)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsQuickSupplierOpen(true)}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Cadastrar Fornecedor
              </button>
            </div>

            {selectedSupplier ? (
              <div className="bg-slate-950 border border-sky-500/50 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100">{selectedSupplier.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {selectedSupplier.personType === 'PF' ? 'CPF: ' : 'CNPJ: '}
                      {formatCpfOrCnpj(selectedSupplier.cpf || selectedSupplier.cnpj, selectedSupplier.personType)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSupplier(null);
                    setSupplierSearchQuery('');
                  }}
                  className="text-xs text-slate-400 hover:text-rose-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  Alterar
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Digite Nome, CPF ou CNPJ para pesquisar..."
                    value={supplierSearchQuery}
                    onChange={(e) => {
                      setSupplierSearchQuery(e.target.value);
                      setShowSupplierDropdown(true);
                    }}
                    onFocus={() => setShowSupplierDropdown(true)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {showSupplierDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                    {filteredSuppliers.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        Nenhum fornecedor encontrado.
                        <button
                          type="button"
                          onClick={() => {
                            setShowSupplierDropdown(false);
                            setIsQuickSupplierOpen(true);
                          }}
                          className="block mx-auto mt-1.5 text-sky-400 font-semibold hover:underline"
                        >
                          + Cadastrar &quot;{supplierSearchQuery}&quot; agora
                        </button>
                      </div>
                    ) : (
                      filteredSuppliers.map((sup) => (
                        <button
                          type="button"
                          key={sup.id}
                          onClick={() => handleSelectSupplier(sup)}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 border-b border-slate-800/50 last:border-[0] flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-slate-200 block">{sup.name}</span>
                            <span className="text-slate-400 text-[10px]">
                              {sup.personType === 'PF' ? 'CPF: ' : 'CNPJ: '}
                              {formatCpfOrCnpj(sup.cpf || sup.cnpj, sup.personType)}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {sup.personType}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Valores e Parcelas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Valor Total (R$) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={value}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue(val);
                  if (!invoiceValue) setInvoiceValue(val);
                }}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Valor Nota Fiscal (R$) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={invoiceValue}
                onChange={(e) => setInvoiceValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Condição / Parcelas</span>
                <span className="text-sky-400 font-normal text-[11px] flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Parcelamento
                </span>
              </label>
              <select
                value={installmentsCount}
                onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value={1}>À Vista (1 parcela)</option>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>
                    {num}x Parcelado ({installmentValuePreview ? formatCurrency(Number(value) / num) : ''}/mês)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Banco Previsto (Previsão de Fluxo por Banco) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Banco Previsto (Para previsão de Fluxo de Caixa por Banco)</span>
                <span className="text-slate-500 font-normal font-sans">(Opcional)</span>
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

            <select
              value={bankAccountId}
              onChange={(e) => setBankAccountId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="">-- Selecione o Banco Previsto (Opcional) --</option>
              {bankAccounts.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.bankName})
                </option>
              ))}
            </select>
          </div>

          {/* 5. Nota fiscal / Cupom fiscal & Data de Vencimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nº Nota Fiscal / Cupom Fiscal <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: NF-10492 ou NFe 5542"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Data do 1º Vencimento <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* 6. Observação */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Observação <span className="text-rose-400">* (Preenchimento livre)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Descreva a finalidade desta despesa..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Lançamento Pendente</span>
            </button>
          </div>
        </form>
      </Modal>

      <QuickSupplierModal
        isOpen={isQuickSupplierOpen}
        onClose={() => setIsQuickSupplierOpen(false)}
        onSupplierCreated={handleQuickSupplierCreated}
      />
    </>
  );
}
