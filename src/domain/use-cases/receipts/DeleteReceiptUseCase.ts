import type { IReceiptRepository } from '../../repositories';

export class DeleteReceiptUseCase {
  constructor(private readonly receiptRepository: IReceiptRepository) {}

  async execute(
    userId: string,
    receiptId: string,
  ): Promise<void> {
    return this.receiptRepository.deleteReceipt(userId, receiptId);
  }
}