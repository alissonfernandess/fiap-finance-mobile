import type { Transaction, TransactionOperation } from '../entities';

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
  operation: TransactionOperation;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  balance: number;
}

export class FinancialCalculator {
  /**
   * Calculate financial summary from transactions
   */
  static calculateSummary(transactions: Transaction[]): FinancialSummary {
    return transactions.reduce<FinancialSummary>(
      (summary, transaction) => {
        if (transaction.operation === 'income') {
          summary.totalIncome += transaction.value;
        } else {
          summary.totalExpense += transaction.value;
        }
        summary.balance = summary.totalIncome - summary.totalExpense;
        return summary;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 },
    );
  }

  /**
   * Calculate summary by category
   */
  static calculateByCategory(
    transactions: Transaction[],
    operation?: TransactionOperation,
  ): CategorySummary[] {
    const filtered = operation
      ? transactions.filter((t) => t.operation === operation)
      : transactions;

    const categoryMap = new Map<string, CategorySummary>();

    for (const transaction of filtered) {
      const key = `${transaction.category}-${transaction.operation}`;
      const existing = categoryMap.get(key);

      if (existing) {
        existing.total += transaction.value;
        existing.count += 1;
      } else {
        categoryMap.set(key, {
          category: transaction.category,
          total: transaction.value,
          count: 1,
          operation: transaction.operation,
        });
      }
    }

    return Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);
  }

  /**
   * Calculate monthly summary
   */
  static calculateMonthlySummary(
    transactions: Transaction[],
    months: number = 12,
  ): MonthlySummary[] {
    const now = new Date();
    const monthlyMap = new Map<string, MonthlySummary>();

    // Initialize last N months
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, {
        month: key,
        income: 0,
        expense: 0,
        balance: 0,
      });
    }

    for (const transaction of transactions) {
      const [day, month, year] = transaction.date.split('/').map(Number);
      const key = `${year}-${String(month).padStart(2, '0')}`;
      const monthly = monthlyMap.get(key);

      if (monthly) {
        if (transaction.operation === 'income') {
          monthly.income += transaction.value;
        } else {
          monthly.expense += transaction.value;
        }
        monthly.balance = monthly.income - monthly.expense;
      }
    }

    return Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Format value from cents to currency string
   */
  static formatCurrency(valueInCents: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valueInCents / 100);
  }

  /**
   * Parse currency string to cents
   */
  static parseCurrency(value: string): number {
    const numeric = Number(value.replace(/\./g, '').replace(',', '.'));
    return Math.round(numeric * 100);
  }
}