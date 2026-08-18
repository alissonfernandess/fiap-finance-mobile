export type TransactionOperation = 'income' | 'expense';

export type TransactionType =
  | 'pix'
  | 'boleto'
  | 'saque'
  | 'deposito'
  | 'ted'
  | 'doc';

export interface Transaction {
  id: string;
  description: string;
  date: string;
  value: number;
  operation: TransactionOperation;
  type: TransactionType;
}