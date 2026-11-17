import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { FinancialCalculator } from '../../domain/services/FinancialCalculator';
import type { FinancialSummary, CategorySummary, MonthlySummary } from '../../domain/services/FinancialCalculator';

export function useFinancialSummary(filters?: { startDate?: string; endDate?: string }) {
  const { data, isLoading } = useTransactions({
    startDate: filters?.startDate,
    endDate: filters?.endDate,
  });

  const summary = useMemo(() => {
    if (!data?.transactions) {
      return { totalIncome: 0, totalExpense: 0, balance: 0 };
    }
    return FinancialCalculator.calculateSummary(data.transactions);
  }, [data?.transactions]);

  const byCategory = useMemo(() => {
    if (!data?.transactions) return [];
    return FinancialCalculator.calculateByCategory(data.transactions);
  }, [data?.transactions]);

  const monthly = useMemo(() => {
    if (!data?.transactions) return [];
    return FinancialCalculator.calculateMonthlySummary(data.transactions);
  }, [data?.transactions]);

  return {
    summary,
    byCategory,
    monthly,
    isLoading,
    transactions: data?.transactions ?? [],
  };
}