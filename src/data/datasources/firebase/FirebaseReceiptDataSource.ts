import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { getFirebaseStorage, getFirebaseAuth } from '@/infrastructure/firebase/config';
import type { Receipt, UploadReceiptDTO, ReceiptFile } from '@/domain/entities';
import type { IReceiptRepository } from '@/domain/repositories';

export class FirebaseReceiptDataSource implements IReceiptRepository {
  private storage = getFirebaseStorage();

  async uploadReceipt(userId: string, data: UploadReceiptDTO): Promise<Receipt> {
    const currentUser = getFirebaseAuth().currentUser;
    if (!currentUser || currentUser.uid !== userId) {
      throw new Error('Usuário não autenticado');
    }

    const response = await fetch(data.file.uri);
    const blob = await response.blob();

    const fileSize = data.file.size ?? blob.size;
    if (fileSize > 5 * 1024 * 1024) {
      throw new Error('O comprovante deve ter no máximo 5 MB.');
    }

    const safeFileName = this.sanitizeFileName(data.file.name);
    const fileRef = ref(
      this.storage,
      `users/${userId}/receipts/${Date.now()}-${safeFileName}`,
    );

    await uploadBytes(fileRef, blob, {
      contentType: data.file.mimeType,
    });

    const downloadUrl = await getDownloadURL(fileRef);

    const receipt: Receipt = {
      id: fileRef.name,
      userId,
      transactionId: data.transactionId,
      fileName: data.file.name,
      mimeType: data.file.mimeType ?? 'application/octet-stream',
      size: blob.size,
      url: downloadUrl,
      uploadedAt: new Date(),
    };

    return receipt;
  }

  async deleteReceipt(userId: string, receiptUrl: string): Promise<void> {
    const currentUser = getFirebaseAuth().currentUser;
    if (!currentUser || currentUser.uid !== userId) {
      throw new Error('Usuário não autenticado');
    }

    const fileRef = ref(this.storage, receiptUrl);
    await deleteObject(fileRef);
  }

  async getReceiptById(userId: string, receiptId: string): Promise<Receipt | null> {
    return null;
  }

  async getReceiptsByTransaction(userId: string, transactionId: string): Promise<Receipt[]> {
    return [];
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }
}