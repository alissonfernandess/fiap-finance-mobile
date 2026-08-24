import { calculateFinancialSummary } from '@/utils/calculateFinancialSummary';

describe('calculateFinancialSummary', () => {
  it('calcula receitas, despesas e saldo', () => {
    const result = calculateFinancialSummary([
      {
        operation: 'income',
        value: 1500,
      },
      {
        operation: 'expense',
        value: 400,
      },
    ]);

    expect(result).toEqual({
      totalIncome: 1500,
      totalExpense: 400,
      balance: 1100,
    });
  });

  it('soma várias receitas', () => {
    const result = calculateFinancialSummary([
      {
        operation: 'income',
        value: 1000,
      },
      {
        operation: 'income',
        value: 500,
      },
    ]);

    expect(result.totalIncome).toBe(1500);
    expect(result.balance).toBe(1500);
  });

  it('permite saldo negativo', () => {
    const result = calculateFinancialSummary([
      {
        operation: 'income',
        value: 200,
      },
      {
        operation: 'expense',
        value: 500,
      },
    ]);

    expect(result.balance).toBe(-300);
  });

  it('retorna valores zerados sem transações', () => {
    const result = calculateFinancialSummary([]);

    expect(result).toEqual({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    });
  });
});