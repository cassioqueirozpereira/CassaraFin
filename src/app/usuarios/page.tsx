'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AccessDenied } from '@/components/common/AccessDenied';
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Eye,
  Trash2,
  Lock,
  Mail,
  User as UserIcon,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { UserRole } from '@/types';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export default function UsuariosPage() {
  const { role, currentUser } = useAuth();
  const isMaster = role === 'master';

  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'plus' as UserRole,
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        // Fallback default users if API unavailable
        setUsers([
          { id: '1', name: 'Administrador Master', email: 'master@torreforte.org', role: 'master' },
          { id: '2', name: 'Operador Financeiro', email: 'plus@torreforte.org', role: 'plus' },
          { id: '3', name: 'Auditor Comum', email: 'comum@torreforte.org', role: 'comum' },
        ]);
      }
    } catch (e) {
      console.error('Erro ao carregar usuários:', e);
      setUsers([
        { id: '1', name: 'Administrador Master', email: 'master@torreforte.org', role: 'master' },
        { id: '2', name: 'Operador Financeiro', email: 'plus@torreforte.org', role: 'plus' },
        { id: '3', name: 'Auditor Comum', email: 'comum@torreforte.org', role: 'comum' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMaster) {
      fetchUsers();
    }
  }, [isMaster]);

  if (!isMaster) {
    return (
      <AccessDenied
        title="Acesso Restrito ao Gerenciamento de Usuários"
        description="Somente usuários com perfil Master têm permissão para cadastrar, alterar e visualizar os usuários do sistema."
      />
    );
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error || 'Erro ao cadastrar usuário.');
      } else {
        setFormSuccess('Usuário cadastrado com sucesso!');
        setFormData({ name: '', email: '', password: '', role: 'plus' });
        fetchUsers();
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess('');
        }, 1200);
      }
    } catch (err) {
      console.error('Erro na criação de usuário:', err);
      setFormError('Erro de conexão ao salvar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (currentUser && currentUser.email === email) {
      alert('Você não pode excluir seu próprio usuário atual.');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${email}?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        alert(data.error || 'Erro ao excluir usuário.');
      }
    } catch (e) {
      console.error('Erro ao excluir usuário:', e);
      alert('Falha ao conectar com o servidor.');
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadge = (uRole: UserRole) => {
    switch (uRole) {
      case 'master':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master (Acesso Total)</span>
          </span>
        );
      case 'plus':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Plus (Restrito)</span>
          </span>
        );
      case 'comum':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Eye className="w-3.5 h-3.5" />
            <span>Comum (Somente Consulta)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/20 border border-purple-500/20 text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Gestão de Usuários e Permissões
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Cadastre e administre os níveis de acesso ao sistema Torre Forte Church
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            title="Atualizar lista"
            className="p-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Usuário</span>
          </button>
        </div>
      </div>

      {/* Role Descriptions Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Perfil Master</span>
          </div>
          <p className="text-xs text-slate-400">
            Acesso total a todos os módulos, cadastros, relatórios e gestão de usuários.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Perfil Plus</span>
          </div>
          <p className="text-xs text-slate-400">
            Lança receitas, despesas e consulta relatórios. Bloqueado em Plano de Contas e Centro de Custo.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs mb-1">
            <Eye className="w-4 h-4" />
            <span>Perfil Comum</span>
          </div>
          <p className="text-xs text-slate-400">
            Acesso de leitura estritamente limitado ao Relatório de Fluxo de Caixa.
          </p>
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200">
            Usuários Cadastrados ({users.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Carregando usuários do sistema...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Nenhum usuário cadastrado além do administrador padrão.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Nível de Acesso</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-100 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        disabled={deletingId === u.id}
                        title="Excluir Usuário"
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Novo Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Cadastrar Novo Usuário</h3>
                  <p className="text-xs text-slate-400">Defina o nome, e-mail, senha e perfil</p>
                </div>
              </div>
            </div>

            {formError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="joao@torreforte.org"
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Senha Inicial
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nível de Acesso (Perfil)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value="plus">Usuário Plus (Lançamentos e Operação)</option>
                  <option value="comum">Usuário Comum (Somente Consulta Fluxo de Caixa)</option>
                  <option value="master">Usuário Master (Acesso Total + Gestão)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Cadastrando...' : 'Salvar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
