import type { Receipt, UploadReceiptDTO, ReceiptFile } from '../../entities';
import type { IReceiptRepository } from '../../repositories';
import { MAX_RECEIPT_SIZE, ALLOWED_RECEIPT_MIME_TYPES } from '../../entities/Receipt';

export class UploadReceiptUseCase {
  constructor(private readonly receiptRepository: IReceiptRepository) {}

  async execute(
    userId: string,
    data: UploadReceiptDTO,
  ): Promise<Receipt> {
    // Validate file
    this.validateFile(data.file);
    return this.receiptRepository.uploadReceipt(userId, data);
  }

  private validateFile(file: ReceiptFile): void {
    if (file.size && file.size > MAX_RECEIPT_SIZE) {
      throw new Error('O comprovante deve ter no máximo 5 MB.');
    }

    if (file.mimeType && !ALLOWED_RECEIPT_MIME_TYPES.includes(file.mimeType as typeof ALLOWED_RECEIPT_MIME_TYPES[0])) {
      throw new Error('Tipo de comprovante não permitido. Use JPEG, PNG ou PDF.');
    }
  }
}