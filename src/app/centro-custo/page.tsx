'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { Modal } from '@/components/common/Modal';
import { CostCenter } from '@/types';
import { Target, Plus, Search, Pencil, Trash2, CheckCircle2, AlertCircle, Building2, Layers, HeartHandshake, Baby, Users } from 'lucide-react';

export default function CentroCustoPage() {
  const { costCenters, addCostCenter, updateCostCenter, deleteCostCenter, payables, receivables } = useFinancial();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCc, setEditingCc] = useState<CostCenter | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredCostCenters = costCenters.filter((cc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return cc.name.toLowerCase().includes(q) || cc.code.toLowerCase().includes(q) || (cc.description || '').toLowerCase().includes(q);
  });

  const openNewModal = () => {
    setEditingCc(null);
    setCode(`CC-0${costCenters.length + 1}`);
    setName('');
    setDescription('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (cc: CostCenter) => {
    setEditingCc(cc);
    setCode(cc.code);
    setName(cc.name);
    setDescription(cc.description || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('O Nome do Centro de Custo é obrigatório.');
      return;
    }

    try {
      if (editingCc) {
        updateCostCenter(editingCc.id, {
          code: code.trim() || editingCc.code,
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else {
        addCostCenter({
          code: code.trim(),
          name: name.trim(),
          description: description.trim() || undefined,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMsg('Ocorreu um erro ao salvar o centro de custo.');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o Centro de Custo "${name}"?`)) {
      deleteCostCenter(id);
    }
  };

  const toggleStatus = (cc: CostCenter) => {
    updateCostCenter(cc.id, { isActive: !cc.isActive });
  };

  // Helper icon decorator based on name
  const getCcIcon = (ccName: string) => {
    const lower = ccName.toLowerCase();
    if (lower.includes('homens')) return <Users className="w-5 h-5 text-sky-400" />;
    if (lower.includes('mulheres')) return <HeartHandshake className="w-5 h-5 text-rose-400" />;
    if (lower.includes('kids') || lower.includes('infantil')) return <Baby className="w-5 h-5 text-amber-400" />;
    return <Building2 className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              4. Módulo — Cadastro de Centros de Custo
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestão de centros de custo da igreja (Torre Forte Church, Homens, Mulheres, Kids e Departamentos)
            </p>
          </div>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Centro de Custo</span>
        </button>
      </div>

      {/* Quick Info Banner for Default Church Cost Centers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {costCenters.map((cc) => {
          const totalPayablesCount = payables.filter((p) => p.costCenterId === cc.id).length;
          const totalReceivablesCount = receivables.filter((r) => r.costCenterId === cc.id).length;

          return (
            <div key={cc.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  {getCcIcon(cc.name)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">{cc.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{cc.code}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {totalPayablesCount + totalReceivablesCount} lancs.
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar & Stats */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, nome ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-purple-500 placeholder-slate-500"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Total cadastrados:</span>
          <span className="font-bold text-purple-400">{costCenters.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-24">Código</th>
                <th className="py-3.5 px-4">Nome do Centro de Custo</th>
                <th className="py-3.5 px-4">Descrição</th>
                <th className="py-3.5 px-4 w-28 text-center">Status</th>
                <th className="py-3.5 px-4 w-32 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCostCenters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    Nenhum centro de custo encontrado.
                  </td>
                </tr>
              ) : (
                filteredCostCenters.map((cc) => (
                  <tr key={cc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-purple-400 font-bold whitespace-nowrap">
                      {cc.code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      <div className="flex items-center gap-2">
                        {getCcIcon(cc.name)}
                        <span>{cc.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {cc.description || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(cc)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-all ${
                          cc.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {cc.isActive ? 'ATIVO' : 'INATIVO'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(cc)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-400 transition-colors"
                          title="Editar Centro de Custo"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cc.id, cc.name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                          title="Excluir Centro de Custo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar / Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCc ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
        subtitle={editingCc ? `Alteração dos dados do centro #${editingCc.code}` : 'Cadastre um novo centro de custo para vincular despesas e receitas'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Código <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: CC-01, CC-HOMENS"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nome do Centro de Custo <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Torre Forte Church, Homens, Mulheres, Kids"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a finalidade deste centro de custo..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              {editingCc ? 'Salvar Alterações' : 'Cadastrar Centro de Custo'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
