import type {
  Transaction,
  UpdateTransactionDTO,
} from '../../entities';
import type { ITransactionRepository } from '../../repositories';
import { TransactionValidator } from '../../services/TransactionValidator';

export class UpdateTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    transactionId: string,
    data: UpdateTransactionDTO,
  ): Promise<Transaction> {
    // Validate input
    const validatedData = TransactionValidator.validateUpdate(data);
    return this.transactionRepository.updateTransaction(userId, transactionId, validatedData);
  }
}