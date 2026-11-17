export type TransactionOperation = 'income' | 'expense';

export type TransactionType =
  | 'pix'
  | 'boleto'
  | 'saque'
  | 'deposito'
  | 'ted'
  | 'doc';

export type TransactionCategory =
  | 'Alimentação'
  | 'Casa'
  | 'Educação'
  | 'Lazer'
  | 'Saúde'
  | 'Salário'
  | 'Transporte'
  | 'Transferência'
  | 'Outros';

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  date: string; // ISO format: YYYY-MM-DD
  value: number; // in cents to avoid floating point issues
  operation: TransactionOperation;
  type: TransactionType;
  category: TransactionCategory;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDTO {
  description: string;
  date: string;
  value: number;
  operation: TransactionOperation;
  type: TransactionType;
  category: TransactionCategory;
  receiptUrl?: string;
}

export interface UpdateTransactionDTO {
  description?: string;
  date?: string;
  value?: number;
  operation?: TransactionOperation;
  type?: TransactionType;
  category?: TransactionCategory;
  receiptUrl?: string | null; // null means remove receipt
}

export interface TransactionFilters {
  search?: string;
  operation?: TransactionOperation | 'all';
  category?: TransactionCategory | 'all';
  startDate?: string; // ISO format
  endDate?: string; // ISO format
  page?: number;
  pageSize?: number;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}