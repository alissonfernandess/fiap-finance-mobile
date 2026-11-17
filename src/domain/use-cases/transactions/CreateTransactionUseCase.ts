import type {
  Transaction,
  CreateTransactionDTO,
} from '../../entities';
import type { ITransactionRepository } from '../../repositories';
import { TransactionValidator } from '../../services/TransactionValidator';

export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction> {
    // Validate input
    const validatedData = TransactionValidator.validateCreate(data);
    return this.transactionRepository.createTransaction(userId, validatedData);
  }
}