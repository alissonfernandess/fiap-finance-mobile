import { useMemo } from 'react';
import {
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import Svg, {
    Circle,
    Line,
    Polyline,
    Text as SvgText,
} from 'react-native-svg';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/theme';
import type { Transaction } from '@/types/transaction';

interface FinancialChartProps {
  transactions: Transaction[];
}

interface MonthlyData {
  key: string;
  label: string;
  income: number;
  expense: number;
}

function parseTransactionDate(value: string) {
  const [day, month, year] = value
    .split('/')
    .map(Number);

  return new Date(year, month - 1, day);
}

function getMonthlyData(
  transactions: Transaction[],
): MonthlyData[] {
  const monthlyMap = new Map<string, MonthlyData>();

  transactions.forEach((transaction) => {
    const date = parseTransactionDate(
      transaction.date,
    );

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${String(month + 1).padStart(
      2,
      '0',
    )}`;

    const existingMonth = monthlyMap.get(key) ?? {
      key,
      label: new Intl.DateTimeFormat('pt-BR', {
        month: 'short',
      })
        .format(date)
        .replace('.', ''),
      income: 0,
      expense: 0,
    };

    if (transaction.operation === 'income') {
      existingMonth.income += transaction.value;
    } else {
      existingMonth.expense += transaction.value;
    }

    monthlyMap.set(key, existingMonth);
  });

  return Array.from(monthlyMap.values())
    .sort((first, second) =>
      first.key.localeCompare(second.key),
    )
    .slice(-6);
}

export function FinancialChart({
  transactions,
}: FinancialChartProps) {
  const { width: windowWidth } =
    useWindowDimensions();

  const monthlyData = useMemo(
    () => getMonthlyData(transactions),
    [transactions],
  );

  const chartWidth = Math.min(
    Math.max(windowWidth - 72, 280),
    380,
  );

  const chartHeight = 220;
  const horizontalPadding = 24;
  const topPadding = 20;
  const bottomPadding = 38;

  const drawableWidth =
    chartWidth - horizontalPadding * 2;

  const drawableHeight =
    chartHeight - topPadding - bottomPadding;

  const maximumValue = Math.max(
    ...monthlyData.map((item) =>
      Math.max(item.income, item.expense),
    ),
    1,
  );

  function getX(index: number) {
    if (monthlyData.length <= 1) {
      return chartWidth / 2;
    }

    return (
      horizontalPadding +
      (index * drawableWidth) /
        (monthlyData.length - 1)
    );
  }

  function getY(value: number) {
    return (
      topPadding +
      drawableHeight -
      (value / maximumValue) * drawableHeight
    );
  }

  const incomePoints = monthlyData
    .map(
      (item, index) =>
        `${getX(index)},${getY(item.income)}`,
    )
    .join(' ');

  const expensePoints = monthlyData
    .map(
      (item, index) =>
        `${getX(index)},${getY(item.expense)}`,
    )
    .join(' ');

  if (monthlyData.length === 0) {
    return (
      <View style={styles.card}>
        <AppText variant="headline">
          Receitas x despesas
        </AppText>

        <View style={styles.emptyState}>
          <AppText
            color={colors.textSecondary}
            align="center"
          >
            Cadastre transações para visualizar o
            gráfico.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText variant="headline">
          Receitas x despesas
        </AppText>

        <AppText color={colors.textSecondary}>
          Últimos meses
        </AppText>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              styles.incomeDot,
            ]}
          />

          <AppText color={colors.textSecondary}>
            Receitas
          </AppText>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              styles.expenseDot,
            ]}
          />

          <AppText color={colors.textSecondary}>
            Despesas
          </AppText>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg
          width={chartWidth}
          height={chartHeight}
        >
          {[0, 0.5, 1].map((percentage) => {
            const y =
              topPadding +
              drawableHeight * percentage;

            return (
              <Line
                key={percentage}
                x1={horizontalPadding}
                x2={
                  chartWidth - horizontalPadding
                }
                y1={y}
                y2={y}
                stroke={colors.surfaceLight}
                strokeWidth={1}
              />
            );
          })}

          {monthlyData.length > 1 && (
            <>
              <Polyline
                points={incomePoints}
                fill="none"
                stroke={colors.income}
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              <Polyline
                points={expensePoints}
                fill="none"
                stroke={colors.expense}
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </>
          )}

          {monthlyData.map((item, index) => (
            <Circle
              key={`income-${item.key}`}
              cx={getX(index)}
              cy={getY(item.income)}
              r={5}
              fill={colors.income}
            />
          ))}

          {monthlyData.map((item, index) => (
            <Circle
              key={`expense-${item.key}`}
              cx={getX(index)}
              cy={getY(item.expense)}
              r={5}
              fill={colors.expense}
            />
          ))}

          {monthlyData.map((item, index) => (
            <SvgText
              key={`label-${item.key}`}
              x={getX(index)}
              y={chartHeight - 10}
              fill={colors.textSecondary}
              fontSize={11}
              textAnchor="middle"
            >
              {item.label}
            </SvgText>
          ))}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    padding: 18,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },

  header: {
    gap: 4,
  },

  legend: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 20,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  incomeDot: {
    backgroundColor: colors.income,
  },

  expenseDot: {
    backgroundColor: colors.expense,
  },

  chartContainer: {
    alignItems: 'center',
    marginTop: 8,
  },

  emptyState: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});