export interface Receipt {
  id: string;
  userId: string;
  transactionId: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface UploadReceiptDTO {
  transactionId: string;
  file: {
    uri: string;
    name: string;
    mimeType?: string;
    size?: number;
  };
}

export interface ReceiptFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

export const ALLOWED_RECEIPT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
] as const;

export const MAX_RECEIPT_SIZE = 5 * 1024 * 1024; // 5MB

export type AllowedMimeType = (typeof ALLOWED_RECEIPT_MIME_TYPES)[number];