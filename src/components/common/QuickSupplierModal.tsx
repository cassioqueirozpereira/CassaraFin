'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { useFinancial } from '@/context/FinancialContext';
import { PersonType, Supplier } from '@/types';
import { Building2, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface QuickSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupplierCreated: (supplier: Supplier) => void;
}

export function QuickSupplierModal({
  isOpen,
  onClose,
  onSupplierCreated,
}: QuickSupplierModalProps) {
  const { addSupplier } = useFinancial();

  const [personType, setPersonType] = useState<PersonType>('PJ');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const resetForm = () => {
    setName('');
    setCpf('');
    setCnpj('');
    setPhone('');
    setEmail('');
    setErrorMsg('');
    setPersonType('PJ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!name.trim()) {
      setErrorMsg('O nome do fornecedor é obrigatório.');
      return;
    }

    if (personType === 'PF' && !cpf.trim()) {
      setErrorMsg('O CPF é obrigatório para Pessoa Física.');
      return;
    }

    if (personType === 'PJ' && !cnpj.trim()) {
      setErrorMsg('O CNPJ é obrigatório para Pessoa Jurídica.');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('O telefone de contato é obrigatório.');
      return;
    }

    if (personType === 'PJ' && !email.trim()) {
      setErrorMsg('O e-mail é obrigatório para cadastros com CNPJ/Pessoa Jurídica.');
      return;
    }

    try {
      const created = addSupplier({
        name: name.trim(),
        personType,
        cpf: personType === 'PF' ? cpf.trim() : undefined,
        cnpj: personType === 'PJ' ? cnpj.trim() : undefined,
        phone: phone.trim(),
        email: email.trim() || undefined,
      });

      onSupplierCreated(created);
      resetForm();
      onClose();
    } catch (err) {
      setErrorMsg('Erro ao cadastrar fornecedor. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Cadastro Rápido de Fornecedor"
      subtitle="Cadastre um novo fornecedor para selecionar imediatamente no lançamento"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tipo de Pessoa */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Tipo de Cadastrado <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPersonType('PJ')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                personType === 'PJ'
                  ? 'bg-sky-600/20 border-sky-500 text-sky-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Pessoa Jurídica (CNPJ)</span>
            </button>

            <button
              type="button"
              onClick={() => setPersonType('PF')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                personType === 'PF'
                  ? 'bg-sky-600/20 border-sky-500 text-sky-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Pessoa Física (CPF)</span>
            </button>
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Nome / Razão Social <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder={personType === 'PJ' ? 'Ex: Distribuidora Silva Ltda' : 'Ex: João da Silva'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* CPF or CNPJ */}
        {personType === 'PF' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              CPF <span className="text-rose-400">* (Obrigatório)</span>
            </label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              CNPJ <span className="text-rose-400">* (Obrigatório)</span>
            </label>
            <input
              type="text"
              placeholder="00.000.000/0001-00"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
            />
          </div>
        )}

        {/* Telefone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Telefone de Contato <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            E-mail{' '}
            {personType === 'PJ' ? (
              <span className="text-rose-400">* (Obrigatório para CNPJ)</span>
            ) : (
              <span className="text-slate-500">(Opcional)</span>
            )}
          </label>
          <input
            type="email"
            placeholder="contato@empresa.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Cadastrar e Selecionar</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
