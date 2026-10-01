'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { useFinancial } from '@/context/FinancialContext';
import { PayableItem, Supplier } from '@/types';
import { formatCpfOrCnpj } from '@/utils/formatters';
import { AlertCircle, CheckCircle2, RotateCcw, Search, UserCheck } from 'lucide-react';

interface EditPayableModalProps {
  payable: PayableItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPayableModal({ payable, isOpen, onClose }: EditPayableModalProps) {
  const { categories, costCenters, suppliers, bankAccounts, updatePayable, revertBaixaPayable } = useFinancial();

  const [categoryId, setCategoryId] = useState('');
  const [costCenterId, setCostCenterId] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const [value, setValue] = useState('');
  const [invoiceValue, setInvoiceValue] = useState('');
  const [paidValue, setPaidValue] = useState('');
  const [observation, setObservation] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const expenseCategories = categories.filter((c) => c.type === 'SAIDA' && c.isActive);

  useEffect(() => {
    if (payable) {
      setCategoryId(payable.categoryId);
      setCostCenterId(payable.costCenterId || '');
      const sup = suppliers.find((s) => s.id === payable.supplierId) || null;
      setSelectedSupplier(sup);
      setSupplierSearchQuery(payable.supplierName || '');
      setValue(payable.value.toString());
      setInvoiceValue(payable.invoiceValue.toString());
      setPaidValue(payable.paidValue ? payable.paidValue.toString() : '');
      setObservation(payable.observation);
      setInvoiceNumber(payable.invoiceNumber);
      setDueDate(payable.dueDate);
      setPaymentDate(payable.paymentDate || '');
      setBankAccountId(payable.bankAccountId || '');
      setErrorMsg('');
    }
  }, [payable, suppliers]);

  if (!payable) return null;

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
    if (!selectedSupplier) {
      setErrorMsg('O Fornecedor é obrigatório.');
      return;
    }
    if (!value || Number(value) <= 0) {
      setErrorMsg('O Valor é obrigatório.');
      return;
    }

    try {
      const bank = bankAccounts.find((b) => b.id === bankAccountId);

      updatePayable(payable.id, {
        categoryId,
        costCenterId: costCenterId || '',
        supplierId: selectedSupplier.id,
        supplierName: selectedSupplier.name,
        value: Number(value),
        invoiceValue: Number(invoiceValue),
        paidValue: payable.status === 'PAGO' ? Number(paidValue || value) : undefined,
        observation: observation.trim(),
        invoiceNumber: invoiceNumber.trim(),
        dueDate,
        paymentDate: payable.status === 'PAGO' ? paymentDate : undefined,
        bankAccountId: payable.status === 'PAGO' ? bankAccountId : undefined,
        bankAccountName: payable.status === 'PAGO' && bank ? `${bank.name} (${bank.bankName})` : undefined,
      });

      onClose();
    } catch (err) {
      setErrorMsg('Erro ao atualizar o lançamento.');
    }
  };

  const handleRevertBaixa = () => {
    if (confirm('Deseja desfazer a baixa e retornar este lançamento para o status Pendente?')) {
      revertBaixaPayable(payable.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Lançamento — Contas a Pagar"
      subtitle={`Alteração dos dados cadastrais e de baixa do lançamento #${payable.id}`}
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

        {/* 2. Fornecedor */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Fornecedor <span className="text-rose-400">*</span>
          </label>

          {selectedSupplier ? (
            <div className="bg-slate-950 border border-sky-500/50 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-xs font-bold text-slate-100">{selectedSupplier.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {formatCpfOrCnpj(selectedSupplier.cpf || selectedSupplier.cnpj, selectedSupplier.personType)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="text-xs text-slate-400 hover:text-rose-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
              >
                Alterar
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

        {/* 3. Valores e Data Vencimento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Valor Original (R$) <span className="text-rose-400">*</span>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Valor Nota Fiscal (R$) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={invoiceValue}
              onChange={(e) => setInvoiceValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Data de Vencimento <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* 4. Dados da Baixa (Se já foi pago) */}
        {payable.status === 'PAGO' && (
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Pago (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={paidValue}
                  onChange={(e) => setPaidValue(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-emerald-400 text-sm rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Data do Pagamento</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
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

        {/* 5. Nº Nota Fiscal & Observação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nº Nota Fiscal / Cupom <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Observação</label>
            <input
              type="text"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
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
