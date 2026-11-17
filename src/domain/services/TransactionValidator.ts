import { z } from 'zod';
import type {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionCategory,
  TransactionOperation,
  TransactionType,
} from '../entities';

export const transactionCategorySchema = z.enum([
  'Alimentação',
  'Casa',
  'Educação',
  'Lazer',
  'Saúde',
  'Salário',
  'Transporte',
  'Transferência',
  'Outros',
]);

export const transactionOperationSchema = z.enum(['income', 'expense']);

export const transactionTypeSchema = z.enum([
  'pix',
  'boleto',
  'saque',
  'deposito',
  'ted',
  'doc',
]);

export const createTransactionSchema = z.object({
  description: z.string().trim().min(3, 'Mínimo 3 caracteres').max(80, 'Máximo 80 caracteres'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (YYYY-MM-DD)'),
  value: z.number().int().positive('Valor deve ser maior que zero'),
  operation: transactionOperationSchema,
  type: transactionTypeSchema,
  category: transactionCategorySchema,
  receiptUrl: z.string().url().optional(),
});

export const updateTransactionSchema = z.object({
  description: z.string().trim().min(3).max(80).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  value: z.number().int().positive().optional(),
  operation: transactionOperationSchema.optional(),
  type: transactionTypeSchema.optional(),
  category: transactionCategorySchema.optional(),
  receiptUrl: z.string().url().nullable().optional(),
});

export class TransactionValidator {
  static validateCreate(data: unknown): CreateTransactionDTO {
    return createTransactionSchema.parse(data);
  }

  static validateUpdate(data: unknown): UpdateTransactionDTO {
    return updateTransactionSchema.parse(data);
  }

  static validateCategory(category: string): TransactionCategory {
    return transactionCategorySchema.parse(category);
  }

  static validateOperation(operation: string): TransactionOperation {
    return transactionOperationSchema.parse(operation);
  }

  static validateType(type: string): TransactionType {
    return transactionTypeSchema.parse(type);
  }
}

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;