import type { Receipt, UploadReceiptDTO, ReceiptFile } from '../entities';

export interface IReceiptRepository {
  /**
   * Upload a receipt file
   */
  uploadReceipt(userId: string, data: UploadReceiptDTO): Promise<Receipt>;

  /**
   * Delete a receipt
   */
  deleteReceipt(userId: string, receiptId: string): Promise<void>;

  /**
   * Get receipt by ID
   */
  getReceiptById(userId: string, receiptId: string): Promise<Receipt | null>;

  /**
   * Get receipts for a transaction
   */
  getReceiptsByTransaction(userId: string, transactionId: string): Promise<Receipt[]>;
}