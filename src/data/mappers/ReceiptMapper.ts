import type { Receipt } from '@/domain/entities';

interface FirestoreReceipt {
  userId: string;
  transactionId: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
}

function toDate(value: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number }): Date {
  if (value && typeof value === 'object' && 'toDate' in value) return value.toDate();
  if (value && typeof value === 'object' && 'seconds' in value) {
    return new Date(value.seconds * 1000 + value.nanoseconds / 1e6);
  }
  return new Date(value);
}

export class ReceiptMapper {
  static fromFirestore(id: string, data: FirestoreReceipt): Receipt {
    return {
      id,
      userId: data.userId,
      transactionId: data.transactionId,
      fileName: data.fileName,
      mimeType: data.mimeType,
      size: data.size,
      url: data.url,
      uploadedAt: toDate(data.uploadedAt),
    };
  }
}