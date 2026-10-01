'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BankAccount, BankAccountType, Category, CostCenter, PayableItem, ReceivableItem, Supplier, PersonType } from '@/types';
import { initialBankAccounts, initialCategories, initialCostCenters, initialPayables, initialReceivables, initialSuppliers } from '@/utils/seedData';

interface AddSupplierDTO {
  name: string;
  personType: PersonType;
  cpf?: string;
  cnpj?: string;
  phone: string;
  email?: string;
}

interface AddCostCenterDTO {
  code: string;
  name: string;
  description?: string;
}

interface AddPayableDTO {
  categoryId: string;
  costCenterId?: string;
  supplierId: string;
  value: number;
  invoiceValue: number;
  observation: string;
  invoiceNumber: string;
  dueDate: string;
  bankAccountId?: string;
  installmentsCount?: number;
}

interface AddReceivableDTO {
  categoryId: string;
  costCenterId?: string;
  supplierId?: string;
  value: number;
  observation?: string;
  dueDate: string;
  bankAccountId?: string;
  installmentsCount?: number;
}

interface AddCategoryDTO {
  code: string;
  name: string;
  type: 'ENTRADA' | 'SAIDA';
  description?: string;
}

interface AddBankAccountDTO {
  name: string;
  bankName: string;
  agency: string;
  accountNumber: string;
  accountType: BankAccountType;
  initialBalance: number;
  color?: string;
}

interface FinancialContextType {
  suppliers: Supplier[];
  categories: Category[];
  costCenters: CostCenter[];
  payables: PayableItem[];
  receivables: ReceivableItem[];
  bankAccounts: BankAccount[];
  
  addSupplier: (data: AddSupplierDTO) => Supplier;
  addCategory: (data: AddCategoryDTO) => Category;
  addCostCenter: (data: AddCostCenterDTO) => CostCenter;
  updateCostCenter: (id: string, updated: Partial<CostCenter>) => void;
  deleteCostCenter: (id: string) => void;

  addBankAccount: (data: AddBankAccountDTO) => BankAccount;
  deleteBankAccount: (id: string) => void;
  
  addPayable: (data: AddPayableDTO) => PayableItem[];
  addReceivable: (data: AddReceivableDTO) => ReceivableItem[];
  
  updatePayable: (id: string, updated: Partial<PayableItem>) => void;
  updateReceivable: (id: string, updated: Partial<ReceivableItem>) => void;

  baixaPayable: (id: string, paidValue: number, bankAccountId: string, paymentDate: string) => void;
  baixaReceivable: (id: string, receivedValue: number, bankAccountId: string, receivedDate: string) => void;
  revertBaixaPayable: (id: string) => void;
  revertBaixaReceivable: (id: string) => void;

  deletePayable: (id: string) => void;
  deleteReceivable: (id: string) => void;
  
  searchSuppliers: (query: string) => Supplier[];
  filterPayablesByPeriod: (startDate: string, endDate: string, bankAccountId?: string) => PayableItem[];
  filterReceivablesByPeriod: (startDate: string, endDate: string, bankAccountId?: string) => ReceivableItem[];
  
  resetToDefaultData: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SUPPLIERS: 'cassarafin_suppliers_v4',
  CATEGORIES: 'cassarafin_categories_v4',
  COST_CENTERS: 'cassarafin_costcenters_v4',
  PAYABLES: 'cassarafin_payables_v4',
  RECEIVABLES: 'cassarafin_receivables_v4',
  BANK_ACCOUNTS: 'cassarafin_banks_v4',
};

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [payables, setPayables] = useState<PayableItem[]>([]);
  const [receivables, setReceivables] = useState<ReceivableItem[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSuppliers = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const storedCostCenters = localStorage.getItem(STORAGE_KEYS.COST_CENTERS);
      const storedPayables = localStorage.getItem(STORAGE_KEYS.PAYABLES);
      const storedReceivables = localStorage.getItem(STORAGE_KEYS.RECEIVABLES);
      const storedBanks = localStorage.getItem(STORAGE_KEYS.BANK_ACCOUNTS);

      setSuppliers(storedSuppliers ? JSON.parse(storedSuppliers) : initialSuppliers);
      setCategories(storedCategories ? JSON.parse(storedCategories) : initialCategories);
      setCostCenters(storedCostCenters ? JSON.parse(storedCostCenters) : initialCostCenters);
      setPayables(storedPayables ? JSON.parse(storedPayables) : initialPayables);
      setReceivables(storedReceivables ? JSON.parse(storedReceivables) : initialReceivables);
      setBankAccounts(storedBanks ? JSON.parse(storedBanks) : initialBankAccounts);
    } catch (e) {
      console.error('Error loading localStorage financial data', e);
      setSuppliers(initialSuppliers);
      setCategories(initialCategories);
      setCostCenters(initialCostCenters);
      setPayables(initialPayables);
      setReceivables(initialReceivables);
      setBankAccounts(initialBankAccounts);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.COST_CENTERS, JSON.stringify(costCenters));
  }, [costCenters, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.PAYABLES, JSON.stringify(payables));
  }, [payables, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.RECEIVABLES, JSON.stringify(receivables));
  }, [receivables, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(bankAccounts));
  }, [bankAccounts, isLoaded]);

  const addSupplier = (dto: AddSupplierDTO): Supplier => {
    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: dto.name,
      personType: dto.personType,
      cpf: dto.cpf,
      cnpj: dto.cnpj,
      phone: dto.phone,
      email: dto.email,
      createdAt: new Date().toISOString(),
    };

    setSuppliers((prev) => [newSupplier, ...prev]);
    return newSupplier;
  };

  const addCategory = (dto: AddCategoryDTO): Category => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      code: dto.code || `${dto.type === 'ENTRADA' ? '1' : '2'}.${Date.now().toString().slice(-4)}`,
      name: dto.name,
      type: dto.type,
      description: dto.description,
      isActive: true,
    };

    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const addCostCenter = (dto: AddCostCenterDTO): CostCenter => {
    const newCostCenter: CostCenter = {
      id: `cc-${Date.now()}`,
      code: dto.code || `CC-0${costCenters.length + 1}`,
      name: dto.name,
      description: dto.description,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setCostCenters((prev) => [...prev, newCostCenter]);
    return newCostCenter;
  };

  const updateCostCenter = (id: string, updated: Partial<CostCenter>) => {
    setCostCenters((prev) =>
      prev.map((cc) => (cc.id === id ? { ...cc, ...updated } : cc))
    );
    // Also sync names in payables & receivables if name changed
    if (updated.name) {
      setPayables((prev) =>
        prev.map((item) => (item.costCenterId === id ? { ...item, costCenterName: updated.name } : item))
      );
      setReceivables((prev) =>
        prev.map((item) => (item.costCenterId === id ? { ...item, costCenterName: updated.name } : item))
      );
    }
  };

  const deleteCostCenter = (id: string) => {
    setCostCenters((prev) => prev.filter((cc) => cc.id !== id));
  };

  const addBankAccount = (dto: AddBankAccountDTO): BankAccount => {
    const newBank: BankAccount = {
      id: `banco-${Date.now()}`,
      name: dto.name,
      bankName: dto.bankName,
      agency: dto.agency,
      accountNumber: dto.accountNumber,
      accountType: dto.accountType,
      initialBalance: Number(dto.initialBalance || 0),
      color: dto.color || '#0284c7',
      createdAt: new Date().toISOString(),
    };

    setBankAccounts((prev) => [...prev, newBank]);
    return newBank;
  };

  const deleteBankAccount = (id: string) => {
    setBankAccounts((prev) => prev.filter((b) => b.id !== id));
  };

  const addPayable = (dto: AddPayableDTO): PayableItem[] => {
    const category = categories.find((c) => c.id === dto.categoryId);
    const costCenter = dto.costCenterId ? costCenters.find((cc) => cc.id === dto.costCenterId) : undefined;
    const supplier = suppliers.find((s) => s.id === dto.supplierId);
    const bank = dto.bankAccountId ? bankAccounts.find((b) => b.id === dto.bankAccountId) : undefined;
    const docNumber = supplier?.personType === 'PF' ? supplier.cpf : supplier?.cnpj;

    const installmentsCount = dto.installmentsCount && dto.installmentsCount > 1 ? dto.installmentsCount : 1;
    const installmentValue = Number((dto.value / installmentsCount).toFixed(2));
    const groupId = `grp-${Date.now()}`;
    const newPayables: PayableItem[] = [];

    const baseDueDate = new Date(dto.dueDate + 'T12:00:00');

    for (let i = 1; i <= installmentsCount; i++) {
      const dueDateObj = new Date(baseDueDate);
      dueDateObj.setMonth(dueDateObj.getMonth() + (i - 1));
      const dueDateStr = dueDateObj.toISOString().split('T')[0];

      const obsSuffix = installmentsCount > 1 ? ` (Parcela ${i} de ${installmentsCount})` : '';

      newPayables.push({
        id: `pay-${Date.now()}-${i}`,
        categoryId: dto.categoryId,
        categoryName: category?.name || 'Despesa Geral',
        costCenterId: dto.costCenterId,
        costCenterName: costCenter?.name,
        supplierId: dto.supplierId,
        supplierName: supplier?.name || 'Fornecedor',
        supplierCpfCnpj: docNumber || '-',
        value: installmentValue,
        invoiceValue: Number(dto.invoiceValue),
        observation: `${dto.observation}${obsSuffix}`,
        invoiceNumber: dto.invoiceNumber,
        dueDate: dueDateStr,
        bankAccountId: dto.bankAccountId,
        bankAccountName: bank ? `${bank.name} (${bank.bankName})` : undefined,
        installmentInfo: installmentsCount > 1 ? { current: i, total: installmentsCount, groupId } : undefined,
        status: 'PENDENTE',
        createdAt: new Date().toISOString(),
      });
    }

    setPayables((prev) => [...newPayables, ...prev]);
    return newPayables;
  };

  const addReceivable = (dto: AddReceivableDTO): ReceivableItem[] => {
    const category = categories.find((c) => c.id === dto.categoryId);
    const costCenter = dto.costCenterId ? costCenters.find((cc) => cc.id === dto.costCenterId) : undefined;
    const supplier = suppliers.find((s) => s.id === dto.supplierId);
    const bank = dto.bankAccountId ? bankAccounts.find((b) => b.id === dto.bankAccountId) : undefined;

    const installmentsCount = dto.installmentsCount && dto.installmentsCount > 1 ? dto.installmentsCount : 1;
    const installmentValue = Number((dto.value / installmentsCount).toFixed(2));
    const groupId = `rec-grp-${Date.now()}`;
    const newReceivables: ReceivableItem[] = [];

    const baseDueDate = new Date(dto.dueDate + 'T12:00:00');

    for (let i = 1; i <= installmentsCount; i++) {
      const dueDateObj = new Date(baseDueDate);
      dueDateObj.setMonth(dueDateObj.getMonth() + (i - 1));
      const dueDateStr = dueDateObj.toISOString().split('T')[0];

      const obsSuffix = installmentsCount > 1 ? ` (Parcela ${i} de ${installmentsCount})` : '';

      newReceivables.push({
        id: `rec-${Date.now()}-${i}`,
        categoryId: dto.categoryId,
        categoryName: category?.name || 'Receita Geral',
        costCenterId: dto.costCenterId,
        costCenterName: costCenter?.name,
        supplierId: dto.supplierId,
        supplierName: supplier ? supplier.name : undefined,
        value: installmentValue,
        observation: dto.observation ? `${dto.observation}${obsSuffix}` : undefined,
        dueDate: dueDateStr,
        bankAccountId: dto.bankAccountId,
        bankAccountName: bank ? `${bank.name} (${bank.bankName})` : undefined,
        installmentInfo: installmentsCount > 1 ? { current: i, total: installmentsCount, groupId } : undefined,
        status: 'PENDENTE',
        createdAt: new Date().toISOString(),
      });
    }

    setReceivables((prev) => [...newReceivables, ...prev]);
    return newReceivables;
  };

  const updatePayable = (id: string, updated: Partial<PayableItem>) => {
    const category = updated.categoryId ? categories.find((c) => c.id === updated.categoryId) : undefined;
    const costCenter = updated.costCenterId ? costCenters.find((cc) => cc.id === updated.costCenterId) : undefined;
    const supplier = updated.supplierId ? suppliers.find((s) => s.id === updated.supplierId) : undefined;
    const bank = updated.bankAccountId ? bankAccounts.find((b) => b.id === updated.bankAccountId) : undefined;
    const docNumber = supplier ? (supplier.personType === 'PF' ? supplier.cpf : supplier.cnpj) : undefined;

    setPayables((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updated,
            categoryName: category ? category.name : item.categoryName,
            costCenterName: updated.costCenterId === '' ? undefined : (costCenter ? costCenter.name : item.costCenterName),
            supplierName: supplier ? supplier.name : item.supplierName,
            supplierCpfCnpj: docNumber || item.supplierCpfCnpj,
            bankAccountName: bank ? `${bank.name} (${bank.bankName})` : item.bankAccountName,
          };
        }
        return item;
      })
    );
  };

  const updateReceivable = (id: string, updated: Partial<ReceivableItem>) => {
    const category = updated.categoryId ? categories.find((c) => c.id === updated.categoryId) : undefined;
    const costCenter = updated.costCenterId ? costCenters.find((cc) => cc.id === updated.costCenterId) : undefined;
    const supplier = updated.supplierId ? suppliers.find((s) => s.id === updated.supplierId) : undefined;
    const bank = updated.bankAccountId ? bankAccounts.find((b) => b.id === updated.bankAccountId) : undefined;

    setReceivables((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updated,
            categoryName: category ? category.name : item.categoryName,
            costCenterName: updated.costCenterId === '' ? undefined : (costCenter ? costCenter.name : item.costCenterName),
            supplierName: supplier ? supplier.name : item.supplierName,
            bankAccountName: bank ? `${bank.name} (${bank.bankName})` : item.bankAccountName,
          };
        }
        return item;
      })
    );
  };

  const baixaPayable = (id: string, paidValue: number, bankAccountId: string, paymentDate: string) => {
    const bank = bankAccounts.find((b) => b.id === bankAccountId);

    setPayables((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            paidValue: Number(paidValue),
            paymentDate,
            bankAccountId,
            bankAccountName: bank ? `${bank.name} (${bank.bankName})` : 'Banco',
            status: 'PAGO',
          };
        }
        return item;
      })
    );
  };

  const baixaReceivable = (id: string, receivedValue: number, bankAccountId: string, receivedDate: string) => {
    const bank = bankAccounts.find((b) => b.id === bankAccountId);

    setReceivables((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            receivedValue: Number(receivedValue),
            receivedDate,
            bankAccountId,
            bankAccountName: bank ? `${bank.name} (${bank.bankName})` : 'Banco',
            status: 'RECEBIDO',
          };
        }
        return item;
      })
    );
  };

  const revertBaixaPayable = (id: string) => {
    setPayables((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            paidValue: undefined,
            paymentDate: undefined,
            bankAccountId: undefined,
            bankAccountName: undefined,
            status: 'PENDENTE',
          };
        }
        return item;
      })
    );
  };

  const revertBaixaReceivable = (id: string) => {
    setReceivables((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            receivedValue: undefined,
            receivedDate: undefined,
            bankAccountId: undefined,
            bankAccountName: undefined,
            status: 'PENDENTE',
          };
        }
        return item;
      })
    );
  };

  const deletePayable = (id: string) => {
    setPayables((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteReceivable = (id: string) => {
    setReceivables((prev) => prev.filter((item) => item.id !== id));
  };

  const searchSuppliers = (query: string): Supplier[] => {
    if (!query || query.trim() === '') return suppliers;
    const cleanQuery = query.toLowerCase().replace(/\D/g, '');
    const term = query.toLowerCase();

    return suppliers.filter((sup) => {
      const nameMatch = sup.name.toLowerCase().includes(term);
      const cpfMatch = sup.cpf ? sup.cpf.replace(/\D/g, '').includes(cleanQuery) : false;
      const cnpjMatch = sup.cnpj ? sup.cnpj.replace(/\D/g, '').includes(cleanQuery) : false;
      const emailMatch = sup.email ? sup.email.toLowerCase().includes(term) : false;
      return nameMatch || cpfMatch || cnpjMatch || emailMatch;
    });
  };

  const filterPayablesByPeriod = (startDate: string, endDate: string, bankAccountId?: string): PayableItem[] => {
    return payables.filter((item) => {
      const date = item.paymentDate || item.dueDate || item.createdAt.split('T')[0];
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      if (bankAccountId && bankAccountId !== 'ALL' && item.bankAccountId !== bankAccountId) return false;
      return true;
    });
  };

  const filterReceivablesByPeriod = (startDate: string, endDate: string, bankAccountId?: string): ReceivableItem[] => {
    return receivables.filter((item) => {
      const date = item.receivedDate || item.dueDate || item.createdAt.split('T')[0];
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      if (bankAccountId && bankAccountId !== 'ALL' && item.bankAccountId !== bankAccountId) return false;
      return true;
    });
  };

  const resetToDefaultData = () => {
    setSuppliers(initialSuppliers);
    setCategories(initialCategories);
    setCostCenters(initialCostCenters);
    setPayables(initialPayables);
    setReceivables(initialReceivables);
    setBankAccounts(initialBankAccounts);
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.COST_CENTERS);
    localStorage.removeItem(STORAGE_KEYS.PAYABLES);
    localStorage.removeItem(STORAGE_KEYS.RECEIVABLES);
    localStorage.removeItem(STORAGE_KEYS.BANK_ACCOUNTS);
  };

  return (
    <FinancialContext.Provider
      value={{
        suppliers,
        categories,
        costCenters,
        payables,
        receivables,
        bankAccounts,
        addSupplier,
        addCategory,
        addCostCenter,
        updateCostCenter,
        deleteCostCenter,
        addBankAccount,
        deleteBankAccount,
        addPayable,
        addReceivable,
        updatePayable,
        updateReceivable,
        baixaPayable,
        baixaReceivable,
        revertBaixaPayable,
        revertBaixaReceivable,
        deletePayable,
        deleteReceivable,
        searchSuppliers,
        filterPayablesByPeriod,
        filterReceivablesByPeriod,
        resetToDefaultData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
}
