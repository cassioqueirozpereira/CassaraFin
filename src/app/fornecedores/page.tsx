'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFinancial } from '@/context/FinancialContext';
import { AccessDenied } from '@/components/common/AccessDenied';
import { Supplier } from '@/types';
import { formatCpfOrCnpj, formatPhone } from '@/utils/formatters';
import { NewSupplierModal } from '@/components/fornecedores/NewSupplierModal';
import { SupplierDetailModal } from '@/components/fornecedores/SupplierDetailModal';
import { Users, Plus, Search, Building2, User, Eye, Phone, Mail } from 'lucide-react';

export default function FornecedoresPage() {
  const { role } = useAuth();
  const { suppliers, searchSuppliers } = useFinancial();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  if (role === 'comum') {
    return <AccessDenied />;
  }

  const displayedSuppliers = searchSuppliers(searchQuery);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">4. Módulo — Cadastro de Fornecedores</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Base cadastral de fornecedores (Pessoa Física / Jurídica) disponíveis nos lançamentos
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cadastro</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar fornecedor por Nome, CPF, CNPJ, E-mail ou Telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {displayedSuppliers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-bold text-slate-300">Nenhum fornecedor localizado</p>
            <p className="text-xs mt-1">Tente ajustar o termo da busca ou cadastre um novo fornecedor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Nome / Razão Social</th>
                  <th className="py-3.5 px-4">Documento (CPF / CNPJ)</th>
                  <th className="py-3.5 px-4">Telefone</th>
                  <th className="py-3.5 px-4">E-mail</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayedSuppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          sup.personType === 'PJ'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}
                      >
                        {sup.personType === 'PJ' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {sup.personType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">{sup.name}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                      {formatCpfOrCnpj(sup.cpf || sup.cnpj, sup.personType)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {formatPhone(sup.phone)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {sup.email ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {sup.email}
                        </span>
                      ) : (
                        <span className="text-slate-600 italic">Não informado</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedSupplier(sup)}
                        className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] transition-colors"
                      >
                        <Eye className="w-3 h-3 text-sky-400" />
                        <span>Consultar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <NewSupplierModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
      <SupplierDetailModal
        supplier={selectedSupplier}
        isOpen={!!selectedSupplier}
        onClose={() => setSelectedSupplier(null)}
      />
    </div>
  );
}
