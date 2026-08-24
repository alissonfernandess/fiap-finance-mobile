import type { Transaction } from '@/types/transaction';

type FinancialTransaction = Pick<
  Transaction,
  'operation' | 'value'
>;

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function calculateFinancialSummary(
  transactions: FinancialTransaction[],
): FinancialSummary {
  return transactions.reduce<FinancialSummary>(
    (summary, transaction) => {
      if (transaction.operation === 'income') {
        summary.totalIncome += transaction.value;
      } else {
        summary.totalExpense += transaction.value;
      }

      summary.balance =
        summary.totalIncome - summary.totalExpense;

      return summary;
    },
    {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    },
  );
}