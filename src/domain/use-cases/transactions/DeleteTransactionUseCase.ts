import type { ITransactionRepository } from '../../repositories';

export class DeleteTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(
    userId: string,
    transactionId: string,
  ): Promise<void> {
    return this.transactionRepository.deleteTransaction(userId, transactionId);
  }
}