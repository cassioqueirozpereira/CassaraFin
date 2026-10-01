'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useFinancial } from '@/context/FinancialContext';
import { CategoryType } from '@/types';
import { AlertCircle, CheckCircle2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewCategoryModal({ isOpen, onClose }: NewCategoryModalProps) {
  const { addCategory } = useFinancial();

  const [type, setType] = useState<CategoryType>('SAIDA');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const resetForm = () => {
    setCode('');
    setName('');
    setDescription('');
    setErrorMsg('');
    setType('SAIDA');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('O nome do tipo de lançamento é obrigatório.');
      return;
    }

    try {
      addCategory({
        code: code.trim(),
        name: name.trim(),
        type,
        description: description.trim() || undefined,
      });

      resetForm();
      onClose();
    } catch (err) {
      setErrorMsg('Erro ao cadastrar novo tipo de lançamento.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Configurar Novo Tipo de Lançamento"
      subtitle="Cadastre novas opções no Plano de Contas para simplificar os lançamentos da igreja"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Natureza */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Natureza do Lançamento <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('ENTRADA')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                type === 'ENTRADA'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Entrada (Receita / Dízimo)</span>
            </button>

            <button
              type="button"
              onClick={() => setType('SAIDA')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                type === 'SAIDA'
                  ? 'bg-rose-600/20 border-rose-500 text-rose-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>Saída (Despesa / Custo)</span>
            </button>
          </div>
        </div>

        {/* Código Contábil */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Código Contábil / Classificação <span className="text-slate-500 font-normal">(Opcional)</span>
          </label>
          <input
            type="text"
            placeholder={type === 'ENTRADA' ? 'Ex: 1.1.05' : 'Ex: 2.3.03'}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Nome do Tipo */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Nome do Tipo de Lançamento <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Manutenção do Sistema de Som, Oferta de Construção"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Descrição / Orientação <span className="text-slate-500 font-normal">(Opcional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Instruções para quando este tipo de lançamento deve ser selecionado..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            <span>Salvar no Plano de Contas</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
