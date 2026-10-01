'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { BankAccountType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Modal } from '@/components/common/Modal';
import { Building2, Plus, Trash2, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';

export default function BancosPage() {
  const { bankAccounts, addBankAccount, deleteBankAccount } = useFinancial();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [agency, setAgency] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<BankAccountType>('CORRENTE');
  const [initialBalance, setInitialBalance] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const resetForm = () => {
    setName('');
    setBankName('');
    setAgency('');
    setAccountNumber('');
    setAccountType('CORRENTE');
    setInitialBalance('');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('O nome de identificação da conta é obrigatório.');
      return;
    }
    if (!bankName.trim()) {
      setErrorMsg('O nome do banco é obrigatório.');
      return;
    }
    if (accountType !== 'CAIXA_FISICO') {
      if (!agency.trim()) {
        setErrorMsg('A agência é obrigatória para contas bancárias.');
        return;
      }
      if (!accountNumber.trim()) {
        setErrorMsg('O número da conta é obrigatório.');
        return;
      }
    }

    try {
      addBankAccount({
        name: name.trim(),
        bankName: bankName.trim(),
        agency: agency.trim() || '-',
        accountNumber: accountNumber.trim() || '-',
        accountType,
        initialBalance: initialBalance ? Number(initialBalance) : 0,
      });

      resetForm();
      setIsNewModalOpen(false);
    } catch (err) {
      setErrorMsg('Erro ao cadastrar conta bancária.');
    }
  };

  const handleDelete = (id: string, bankAccountName: string) => {
    if (confirm(`Tem certeza que deseja excluir a conta bancária "${bankAccountName}"?`)) {
      deleteBankAccount(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Cadastro — Bancos e Contas Bancárias</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cadastre e gerencie as contas bancárias e caixas da igreja disponíveis para baixas de lançamentos
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-sky-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Incluir Novo Banco</span>
        </button>
      </div>

      {/* Info notice if 0 banks */}
      {bankAccounts.length === 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl text-xs text-amber-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-200">Nenhum banco ou caixa cadastrado no momento</p>
            <p className="text-slate-300 mt-1">
              Cadastre suas contas bancárias (Conta Corrente, Conta Poupança ou Caixa Físico em espécie) para que fiquem disponíveis no momento de efetuar as baixas no Contas a Pagar e Contas a Receber.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Registered Bank Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bankAccounts.map((b) => (
          <div
            key={b.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                    {b.accountType === 'CAIXA_FISICO' ? <Wallet className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{b.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{b.bankName}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                    b.accountType === 'CORRENTE'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      : b.accountType === 'POUPANCA'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {b.accountType === 'CORRENTE'
                    ? 'Conta Corrente'
                    : b.accountType === 'POUPANCA'
                    ? 'Conta Poupança'
                    : 'Caixa Físico'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Agência:</span>
                  <span className="text-slate-200 font-bold">{b.agency}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Conta:</span>
                  <span className="text-slate-200 font-bold">{b.accountNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Saldo Inicial</span>
                <span className="text-sm font-bold text-slate-200">{formatCurrency(b.initialBalance)}</span>
              </div>

              <button
                onClick={() => handleDelete(b.id, b.name)}
                title="Excluir Conta Bancária"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Bank Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => {
          resetForm();
          setIsNewModalOpen(false);
        }}
        title="Incluir Novo Banco / Conta Bancária"
        subtitle="Cadastre uma conta corrente, poupança ou caixa em espécie para conciliação e baixas"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Nome da Conta / Identificação */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nome de Identificação da Conta <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Conta Principal Templo, Conta Missões, Caixa Físico"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Nome do Banco */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nome do Banco / Instituição <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Banco Itaú, Banco do Brasil, Bradesco, Caixa Econômica, NuBank, Tesouraria"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Tipo de Conta */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Tipo da Conta <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('CORRENTE')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  accountType === 'CORRENTE'
                    ? 'bg-sky-600/20 border-sky-500 text-sky-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Conta Corrente
              </button>

              <button
                type="button"
                onClick={() => setAccountType('POUPANCA')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  accountType === 'POUPANCA'
                    ? 'bg-sky-600/20 border-sky-500 text-sky-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Conta Poupança
              </button>

              <button
                type="button"
                onClick={() => setAccountType('CAIXA_FISICO')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  accountType === 'CAIXA_FISICO'
                    ? 'bg-sky-600/20 border-sky-500 text-sky-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Caixa Físico
              </button>
            </div>
          </div>

          {/* Agência e Conta */}
          {accountType !== 'CAIXA_FISICO' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Agência <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1234"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Número da Conta <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: 56789-0"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* Saldo Inicial */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Saldo Inicial (R$) <span className="text-slate-500 font-normal">(Opcional)</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsNewModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Banco</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
