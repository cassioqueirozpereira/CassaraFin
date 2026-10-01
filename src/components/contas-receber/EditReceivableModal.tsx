'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { useFinancial } from '@/context/FinancialContext';
import { ReceivableItem, Supplier } from '@/types';
import { AlertCircle, CheckCircle2, RotateCcw, Search, UserCheck } from 'lucide-react';

interface EditReceivableModalProps {
  receivable: ReceivableItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditReceivableModal({ receivable, isOpen, onClose }: EditReceivableModalProps) {
  const { categories, costCenters, suppliers, bankAccounts, updateReceivable, revertBaixaReceivable } = useFinancial();

  const [categoryId, setCategoryId] = useState('');
  const [costCenterId, setCostCenterId] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const [value, setValue] = useState('');
  const [receivedValue, setReceivedValue] = useState('');
  const [observation, setObservation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const incomeCategories = categories.filter((c) => c.type === 'ENTRADA' && c.isActive);

  useEffect(() => {
    if (receivable) {
      setCategoryId(receivable.categoryId);
      setCostCenterId(receivable.costCenterId || '');
      const sup = suppliers.find((s) => s.id === receivable.supplierId) || null;
      setSelectedSupplier(sup);
      setSupplierSearchQuery(receivable.supplierName || '');
      setValue(receivable.value.toString());
      setReceivedValue(receivable.receivedValue ? receivable.receivedValue.toString() : '');
      setObservation(receivable.observation || '');
      setDueDate(receivable.dueDate || '');
      setReceivedDate(receivable.receivedDate || '');
      setBankAccountId(receivable.bankAccountId || '');
      setErrorMsg('');
    }
  }, [receivable, suppliers]);

  if (!receivable) return null;

  const filteredSuppliers = suppliers.filter((sup) => {
    if (!supplierSearchQuery) return true;
    const term = supplierSearchQuery.toLowerCase();
    return sup.name.toLowerCase().includes(term);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!categoryId) {
      setErrorMsg('O Tipo de Lançamento é obrigatório.');
      return;
    }
    if (!value || Number(value) <= 0) {
      setErrorMsg('O Valor é obrigatório.');
      return;
    }

    try {
      const bank = bankAccounts.find((b) => b.id === bankAccountId);

      updateReceivable(receivable.id, {
        categoryId,
        costCenterId: costCenterId || '',
        supplierId: selectedSupplier ? selectedSupplier.id : undefined,
        supplierName: selectedSupplier ? selectedSupplier.name : undefined,
        value: Number(value),
        receivedValue: receivable.status === 'RECEBIDO' ? Number(receivedValue || value) : undefined,
        observation: observation.trim() || undefined,
        dueDate,
        receivedDate: receivable.status === 'RECEBIDO' ? receivedDate : undefined,
        bankAccountId: receivable.status === 'RECEBIDO' ? bankAccountId : undefined,
        bankAccountName: receivable.status === 'RECEBIDO' && bank ? `${bank.name} (${bank.bankName})` : undefined,
      });

      onClose();
    } catch (err) {
      setErrorMsg('Erro ao atualizar a receita.');
    }
  };

  const handleRevertBaixa = () => {
    if (confirm('Deseja desfazer a baixa e retornar este lançamento de receita para o status Pendente?')) {
      revertBaixaReceivable(receivable.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Lançamento — Contas a Receber"
      subtitle={`Alteração dos dados cadastrais e de baixa da receita #${receivable.id}`}
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
              Tipo de Lançamento (Plano de Contas) <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
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

        {/* 2. Valor Original e Vencimento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Valor Previsto (R$) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Data de Previsão</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* 3. Fornecedor / Doador (Opcional) */}
        <div>
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
                onClick={() => setSelectedSupplier(null)}
                className="text-xs text-slate-400 hover:text-rose-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                Remover
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar fornecedor..."
                value={supplierSearchQuery}
                onChange={(e) => {
                  setSupplierSearchQuery(e.target.value);
                  setShowSupplierDropdown(true);
                }}
                onFocus={() => setShowSupplierDropdown(true)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-sky-500"
              />

              {showSupplierDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                  {filteredSuppliers.map((sup) => (
                    <button
                      type="button"
                      key={sup.id}
                      onClick={() => {
                        setSelectedSupplier(sup);
                        setShowSupplierDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 border-b border-slate-800/50 text-xs"
                    >
                      <span className="font-semibold text-slate-200 block">{sup.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Dados da Baixa (Se já foi recebido) */}
        {receivable.status === 'RECEBIDO' && (
          <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Dados da Baixa Manual (Efetuada)
              </span>
              <button
                type="button"
                onClick={handleRevertBaixa}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Desfazer Baixa (Voltar p/ Pendente)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Recebido (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={receivedValue}
                  onChange={(e) => setReceivedValue(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-emerald-400 text-sm rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Data do Recebimento</label>
                <input
                  type="date"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Conta Bancária</label>
                <select
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2 cursor-pointer"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.bankName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 5. Observação */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Observação</label>
          <textarea
            rows={2}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
          />
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
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
