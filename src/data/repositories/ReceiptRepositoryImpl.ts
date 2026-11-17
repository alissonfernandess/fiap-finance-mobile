import type { IReceiptRepository } from '../../domain/repositories';
import type { Receipt, UploadReceiptDTO } from '../../domain/entities';
import { FirebaseReceiptDataSource } from '../datasources/firebase/FirebaseReceiptDataSource';

export class ReceiptRepositoryImpl implements IReceiptRepository {
  private dataSource = new FirebaseReceiptDataSource();

  async uploadReceipt(userId: string, data: UploadReceiptDTO): Promise<Receipt> {
    return this.dataSource.uploadReceipt(userId, data);
  }

  async deleteReceipt(userId: string, receiptId: string): Promise<void> {
    return this.dataSource.deleteReceipt(userId, receiptId);
  }

  async getReceiptById(userId: string, receiptId: string): Promise<Receipt | null> {
    return this.dataSource.getReceiptById(userId, receiptId);
  }

  async getReceiptsByTransaction(userId: string, transactionId: string): Promise<Receipt[]> {
    return this.dataSource.getReceiptsByTransaction(userId, transactionId);
  }
}