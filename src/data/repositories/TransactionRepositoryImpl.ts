import type { ITransactionRepository } from '@/domain/repositories';
import type { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionFilters, PaginatedTransactions } from '@/domain/entities';
import { FirebaseTransactionDataSource } from '@/data/datasources/firebase/FirebaseTransactionDataSource';
import { CacheStorage } from '@/data/datasources/local/SecureStorage';
import { queryKeys } from '@/data/cache/queryKeys';
import { queryClient } from '@/data/cache/queryClient';

export class TransactionRepositoryImpl implements ITransactionRepository {
  private dataSource = new FirebaseTransactionDataSource();

  async getTransactions(
    userId: string,
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactions> {
    const cacheKey = `transactions_${userId}_${JSON.stringify(filters)}`;
    const cached = await CacheStorage.getItem<PaginatedTransactions>(cacheKey);
    if (cached) return cached;

    const result = await this.dataSource.getTransactions(userId, filters);
    
    await CacheStorage.setItem(cacheKey, result, 1000 * 60 * 2);
    
    return result;
  }

  async getTransactionById(
    userId: string,
    transactionId: string,
  ): Promise<Transaction | null> {
    return this.dataSource.getTransactionById(userId, transactionId);
  }

  async createTransaction(
    userId: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction> {
    const transaction = await this.dataSource.createTransaction(userId, data);
    
    await this.invalidateTransactionCache(userId);
    
    return transaction;
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionDTO,
  ): Promise<Transaction> {
    const transaction = await this.dataSource.updateTransaction(userId, transactionId, data);
    
    await this.invalidateTransactionCache(userId);
    
    return transaction;
  }

  async deleteTransaction(
    userId: string,
    transactionId: string,
  ): Promise<void> {
    await this.dataSource.deleteTransaction(userId, transactionId);
    
    await this.invalidateTransactionCache(userId);
  }

  subscribeToTransactions(
    userId: string,
    callback: (transactions: Transaction[]) => void,
  ): () => void {
    return this.dataSource.subscribeToTransactions(userId, callback);
  }

  private async invalidateTransactionCache(userId: string): Promise<void> {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.list(userId) });
    
    const keys = await CacheStorage.getAllKeys();
    const transactionKeys = keys.filter((k) => k.startsWith(`transactions_${userId}_`));
    await Promise.all(transactionKeys.map((k) => CacheStorage.removeItem(k.replace('cache_', ''))));
  }
}