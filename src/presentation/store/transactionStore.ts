import { create } from 'zustand';
import type { Transaction, TransactionFilters, PaginatedTransactions } from '../../domain/entities';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  filters: TransactionFilters;
  pagination: PaginatedTransactions | null;
  
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: TransactionFilters) => void;
  setPagination: (pagination: PaginatedTransactions) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (transactionId: string) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  filters: {},
  pagination: null,

  setTransactions: (transactions) => set({ transactions }),
  setLoading: (isLoading) => set({ isLoading }),
  setFilters: (filters) => set({ filters }),
  setPagination: (pagination) => set({ pagination }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  updateTransaction: (transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === transaction.id ? transaction : t,
      ),
    })),
  removeTransaction: (transactionId) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== transactionId),
    })),
  clearTransactions: () => set({ transactions: [], pagination: null }),
}));