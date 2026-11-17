import { FinancialCalculator, type Transaction } from '@/domain/services/FinancialCalculator';

describe('FinancialCalculator', () => {
  const createTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
    id: '1',
    description: 'Test',
    value: 1000,
    operation: 'income',
    category: 'Salário',
    date: '2024-01-15',
    type: 'deposito',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  describe('calculateSummary', () => {
    it('calcula receitas, despesas e saldo', () => {
      const transactions = [
        createTransaction({ operation: 'income', value: 1500 }),
        createTransaction({ operation: 'expense', value: 400 }),
      ];

      const result = FinancialCalculator.calculateSummary(transactions);

      expect(result).toEqual({
        totalIncome: 1500,
        totalExpense: 400,
        balance: 1100,
      });
    });

    it('soma várias receitas', () => {
      const transactions = [
        createTransaction({ operation: 'income', value: 1000 }),
        createTransaction({ operation: 'income', value: 500 }),
      ];

      const result = FinancialCalculator.calculateSummary(transactions);

      expect(result.totalIncome).toBe(1500);
      expect(result.balance).toBe(1500);
    });

    it('permite saldo negativo', () => {
      const transactions = [
        createTransaction({ operation: 'income', value: 200 }),
        createTransaction({ operation: 'expense', value: 500 }),
      ];

      const result = FinancialCalculator.calculateSummary(transactions);

      expect(result.balance).toBe(-300);
    });

    it('retorna valores zerados sem transações', () => {
      const result = FinancialCalculator.calculateSummary([]);

      expect(result).toEqual({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
      });
    });
  });
});