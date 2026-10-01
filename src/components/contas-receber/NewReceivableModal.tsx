'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useFinancial } from '@/context/FinancialContext';
import { Supplier } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { AlertCircle, CheckCircle2, Search, UserCheck, Layers, Building2, Plus } from 'lucide-react';
import Link from 'next/link';

interface NewReceivableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewReceivableModal({ isOpen, onClose }: NewReceivableModalProps) {
  const { categories, costCenters, suppliers, bankAccounts, addReceivable } = useFinancial();

  const [categoryId, setCategoryId] = useState('');
  const [costCenterId, setCostCenterId] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const [value, setValue] = useState('');
  const [observation, setObservation] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bankAccountId, setBankAccountId] = useState('');
  const [installmentsCount, setInstallmentsCount] = useState(1);

  const [errorMsg, setErrorMsg] = useState('');

  const incomeCategories = categories.filter((c) => c.type === 'ENTRADA' && c.isActive);

  const filteredSuppliers = suppliers.filter((sup) => {
    if (!supplierSearchQuery) return true;
    const term = supplierSearchQuery.toLowerCase();
    return sup.name.toLowerCase().includes(term);
  });

  const resetForm = () => {
    setCategoryId('');
    setCostCenterId('');
    setSelectedSupplier(null);
    setSupplierSearchQuery('');
    setValue('');
    setObservation('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setBankAccountId('');
    setInstallmentsCount(1);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!categoryId) {
      setErrorMsg('Por favor, selecione o Tipo de Lançamento (Plano de Contas).');
      return;
    }

    if (!value || Number(value) <= 0) {
      setErrorMsg('O Valor da receita é obrigatório e deve ser maior que zero.');
      return;
    }

    try {
      addReceivable({
        categoryId,
        costCenterId: costCenterId || undefined,
        supplierId: selectedSupplier ? selectedSupplier.id : undefined,
        value: Number(value),
        observation: observation.trim() || undefined,
        dueDate,
        bankAccountId: bankAccountId || undefined,
        installmentsCount,
      });

      resetForm();
      onClose();
    } catch (err) {
      setErrorMsg('Ocorreu um erro ao salvar a receita.');
    }
  };

  const installmentValuePreview = value && Number(value) > 0 && installmentsCount > 1
    ? (Number(value) / installmentsCount)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Novo Lançamento — Contas a Receber"
      subtitle="Apenas o Tipo de Lançamento e Valor são obrigatórios. O registro fica em Abertura/Pendente até a Baixa Manual."
      maxWidth="lg"
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
              Tipo de Lançamento (Plano de Contas) <span className="text-rose-400">* (Obrigatório)</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="">-- Selecione a Categoria de Receita --</option>
              {incomeCategories.map((cat) => (
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

        {/* 2. Valor (Obrigatório) & Parcelamento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Valor Total (R$) <span className="text-rose-400">* (Obrigatório)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Data de Previsão <span className="text-slate-500 font-normal">(1º Vencimento)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Parcelamento</span>
              <span className="text-sky-400 font-normal text-[11px] flex items-center gap-1">
                <Layers className="w-3 h-3" /> Parcelas
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

        {/* 3. Banco Previsto (Previsão de Fluxo por Banco) */}
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

        {/* 4. Fornecedor / Doador (Opcional) */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Fornecedor / Doador <span className="text-slate-500 font-normal">(Opcional)</span>
          </label>

          {selectedSupplier ? (
            <div className="bg-slate-950 border border-sky-500/50 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-xs font-bold text-slate-100">{selectedSupplier.name}</p>
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
                Remover
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Pesquisar fornecedor cadastrado (opcional)..."
                  value={supplierSearchQuery}
                  onChange={(e) => {
                    setSupplierSearchQuery(e.target.value);
                    setShowSupplierDropdown(true);
                  }}
                  onFocus={() => setShowSupplierDropdown(true)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-sky-500"
                />
              </div>

              {showSupplierDropdown && supplierSearchQuery && (
                <div className="absolute z-20 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                  {filteredSuppliers.map((sup) => (
                    <button
                      type="button"
                      key={sup.id}
                      onClick={() => {
                        setSelectedSupplier(sup);
                        setShowSupplierDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 border-b border-slate-800/50 last:border-[0] text-xs transition-colors"
                    >
                      <span className="font-semibold text-slate-200">{sup.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Observação (Opcional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Observação <span className="text-slate-500 font-normal">(Opcional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Informações adicionais sobre esta entrada de recurso..."
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
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Lançamento Pendente</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
