import type {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilters,
  PaginatedTransactions,
} from '../entities';

export interface ITransactionRepository {
  /**
   * Get paginated transactions with filters
   */
  getTransactions(
    userId: string,
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactions>;

  /**
   * Get a single transaction by ID
   */
  getTransactionById(
    userId: string,
    transactionId: string,
  ): Promise<Transaction | null>;

  /**
   * Create a new transaction
   */
  createTransaction(
    userId: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction>;

  /**
   * Update an existing transaction
   */
  updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionDTO,
  ): Promise<Transaction>;

  /**
   * Delete a transaction
   */
  deleteTransaction(
    userId: string,
    transactionId: string,
  ): Promise<void>;

  /**
   * Subscribe to real-time transaction updates
   * Returns unsubscribe function
   */
  subscribeToTransactions(
    userId: string,
    callback: (transactions: Transaction[]) => void,
  ): () => void;
}