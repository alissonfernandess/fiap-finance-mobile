import type {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilters,
  PaginatedTransactions,
} from '../../entities';
import type { ITransactionRepository } from '../../repositories';

export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactions> {
    return this.transactionRepository.getTransactions(userId, filters);
  }
}