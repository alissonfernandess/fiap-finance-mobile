import { z } from 'zod';

export const transactionCategories = [
  'Alimentação',
  'Casa',
  'Educação',
  'Lazer',
  'Saúde',
  'Salário',
  'Transporte',
  'Transferência',
  'Outros',
] as const;

export type TransactionCategory =
  (typeof transactionCategories)[number];

function parseAmount(value: string) {
  return Number(
    value
      .replace(/\./g, '')
      .replace(',', '.'),
  );
}

export const transactionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(3, 'Informe pelo menos 3 caracteres')
    .max(
      80,
      'A descrição deve ter no máximo 80 caracteres',
    ),

  amount: z
    .string()
    .trim()
    .min(1, 'Informe o valor')
    .refine(
      (value) => {
        const amount = parseAmount(value);

        return (
          Number.isFinite(amount) &&
          amount > 0
        );
      },
      {
        message: 'Informe um valor maior que zero',
      },
    ),

  operation: z.enum(['income', 'expense'], {
    message: 'Selecione o tipo da transação',
  }),

  category: z.enum(transactionCategories, {
    message: 'Selecione uma categoria',
  }),

  date: z
    .string()
    .min(1, 'Informe a data')
    .refine(
      (value) => {
        const date = new Date(
          `${value}T00:00:00`,
        );

        return !Number.isNaN(date.getTime());
      },
      {
        message: 'Informe uma data válida',
      },
    ),
});

export type TransactionFormData = z.infer<
  typeof transactionSchema
>;