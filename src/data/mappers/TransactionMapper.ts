import type { Transaction, CreateTransactionDTO, UpdateTransactionDTO } from '@/domain/entities';

interface FirestoreTransaction {
  description: string;
  date: string;
  value: number;
  operation: 'income' | 'expense';
  type: 'pix' | 'boleto' | 'saque' | 'deposito' | 'ted' | 'doc';
  category: string;
  receiptUrl?: string;
  createdAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
  updatedAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
}

function toDate(value: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number }): Date {
  if (value && typeof value === 'object' && 'toDate' in value) return value.toDate();
  if (value && typeof value === 'object' && 'seconds' in value) {
    return new Date(value.seconds * 1000 + value.nanoseconds / 1e6);
  }
  return new Date(value);
}

export class TransactionMapper {
  static fromFirestore(id: string, data: FirestoreTransaction): Transaction {
    return {
      id,
      userId: '',
      description: data.description,
      date: data.date,
      value: data.value,
      operation: data.operation,
      type: data.type,
      category: data.category as Transaction['category'],
      receiptUrl: data.receiptUrl,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  }

  static toFirestore(data: CreateTransactionDTO): FirestoreTransaction {
    return {
      description: data.description,
      date: data.date,
      value: data.value,
      operation: data.operation,
      type: data.type,
      category: data.category,
      receiptUrl: data.receiptUrl,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    };
  }

  static toFirestoreUpdate(data: UpdateTransactionDTO): Partial<FirestoreTransaction> {
    const update: Partial<FirestoreTransaction> = {};
    
    if (data.description !== undefined) update.description = data.description;
    if (data.date !== undefined) update.date = data.date;
    if (data.value !== undefined) update.value = data.value;
    if (data.operation !== undefined) update.operation = data.operation;
    if (data.type !== undefined) update.type = data.type;
    if (data.category !== undefined) update.category = data.category;
    if (data.receiptUrl !== undefined) update.receiptUrl = data.receiptUrl ?? undefined;

    return update;
  }
}