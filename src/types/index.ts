export type UserRole = 'gestor' | 'admin' | 'operador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type PersonType = 'PF' | 'PJ';

export interface Supplier {
  id: string;
  name: string;
  personType: PersonType;
  cpf?: string;
  cnpj?: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export type CategoryType = 'ENTRADA' | 'SAIDA';

export interface Category {
  id: string;
  code: string;
  name: string;
  type: CategoryType;
  description?: string;
  isActive: boolean;
}

export type BankAccountType = 'CORRENTE' | 'POUPANCA' | 'CAIXA_FISICO';

export interface BankAccount {
  id: string;
  name: string; // Nome de identificação (ex: Conta Principal Templo)
  bankName: string; // Nome do banco (ex: Banco Itaú, Banco do Brasil)
  agency: string; // Agência
  accountNumber: string; // Conta com dígito
  accountType: BankAccountType; // Corrente, Poupança, Caixa Físico
  initialBalance: number;
  color?: string;
  createdAt: string;
}

export interface InstallmentInfo {
  current: number;
  total: number;
  groupId: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PayableItem {
  id: string;
  categoryId: string;
  categoryName: string;
  costCenterId?: string;
  costCenterName?: string;
  supplierId: string;
  supplierName: string;
  supplierCpfCnpj: string;
  value: number; // Valor original do lançamento/parcela
  invoiceValue: number; // Valor da nota fiscal
  paidValue?: number; // Preenchido na baixa manual
  observation: string; // Observação obrigatória
  invoiceNumber: string; // Nota fiscal / Cupom fiscal
  dueDate: string;
  paymentDate?: string; // Preenchido na baixa manual
  bankAccountId?: string; // Banco selecionado na baixa manual
  bankAccountName?: string;
  installmentInfo?: InstallmentInfo;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  createdAt: string;
}

export interface ReceivableItem {
  id: string;
  categoryId: string;
  categoryName: string;
  costCenterId?: string;
  costCenterName?: string;
  supplierId?: string; // Optional supplier
  supplierName?: string;
  value: number; // Valor original
  receivedValue?: number; // Preenchido na baixa manual
  observation?: string; // Observação (opcional)
  dueDate?: string; // Data prevista de vencimento
  receivedDate?: string; // Preenchido na baixa manual
  bankAccountId?: string; // Banco selecionado na baixa manual
  bankAccountName?: string;
  installmentInfo?: InstallmentInfo;
  status: 'PENDENTE' | 'RECEBIDO' | 'CANCELADO';
  createdAt: string;
}

export interface OFXTransaction {
  id: string;
  fitid: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  memo: string;
  checkNumber?: string;
  reconciliationStatus?: 'CONCILIADO' | 'DIVERGENTE' | 'NAO_ENCONTRADO';
  matchedSystemId?: string;
  matchedSystemType?: 'PAYABLE' | 'RECEIVABLE';
  divergenceReason?: string;
}
