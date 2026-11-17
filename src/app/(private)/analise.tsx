import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { FinancialChart } from '@/components/charts/FinancialChart';
import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/common/Screen';
import { SideMenu } from '@/components/navigation/SideMenu';
import { useFinancialSummary } from '@/presentation/hooks/useFinancialSummary';
import { useUIStore } from '@/presentation/store/uiStore';
import { colors, fontFamily } from '@/theme';
import { FinancialCalculator } from '@/domain/services/FinancialCalculator';

function formatCurrency(valueInCents: number) {
  return FinancialCalculator.formatCurrency(valueInCents);
}

export default function AnalysisScreen() {
  const { summary, byCategory, monthly, isLoading } = useFinancialSummary();
  const { isSideMenuOpen, closeSideMenu } = useUIStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'category'>('month');

  if (isLoading) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.loadingContainer}>
          <AppText variant="headline">Carregando análise...</AppText>
        </View>
      </Screen>
    );
  }

  return (
    <>
      <Screen scrollable style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir menu"
            hitSlop={12}
            onPress={() => useUIStore.getState().openSideMenu()}
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          >
            <Ionicons name="menu-outline" size={26} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.header}>
          <AppText variant="title">Análise financeira</AppText>
          <AppText color={colors.textSecondary}>Acompanhe o desempenho das suas finanças.</AppText>
        </View>

        <View style={styles.summary}>
          <View style={styles.balanceCard}>
            <AppText color={colors.textSecondary}>Saldo total</AppText>
            <AppText variant="headline" style={styles.balanceValue}>
              {formatCurrency(summary.balance)}
            </AppText>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="arrow-up-circle-outline" size={24} color={colors.income} />
              <AppText color={colors.textSecondary} style={styles.summaryLabel}>Receitas</AppText>
              <AppText color={colors.income} style={styles.summaryValue}>
                {formatCurrency(summary.totalIncome)}
              </AppText>
            </View>

            <View style={styles.summaryCard}>
              <Ionicons name="arrow-down-circle-outline" size={24} color={colors.expense} />
              <AppText color={colors.textSecondary} style={styles.summaryLabel}>Despesas</AppText>
              <AppText color={colors.expense} style={styles.summaryValue}>
                {formatCurrency(summary.totalExpense)}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.periodSelector}>
          <Pressable
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <AppText
              style={[
                styles.periodButtonText,
                selectedPeriod === 'month' && styles.periodButtonTextActive,
              ]}
            >
              Mensal
            </AppText>
          </Pressable>
          <Pressable
            style={[
              styles.periodButton,
              selectedPeriod === 'category' && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod('category')}
          >
            <AppText
              style={[
                styles.periodButtonText,
                selectedPeriod === 'category' && styles.periodButtonTextActive,
              ]}
            >
              Por Categoria
            </AppText>
          </Pressable>
        </View>

        <View style={styles.chart}>
          <FinancialChart
            type={selectedPeriod === 'month' ? 'monthly' : 'category'}
            data={selectedPeriod === 'month' ? monthly : byCategory}
          />
        </View>
      </Screen>

      <SideMenu visible={isSideMenuOpen} onClose={closeSideMenu} />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  topBar: {
    minHeight: 48,
    justifyContent: 'center',
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  header: {
    marginTop: 8,
    gap: 6,
  },
  summary: {
    marginTop: 24,
    gap: 12,
  },
  balanceCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  balanceValue: {
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minHeight: 130,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  summaryLabel: {
    marginTop: 12,
  },
  summaryValue: {
    marginTop: 6,
    fontFamily: fontFamily.bold,
  },
  periodSelector: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  periodButtonTextActive: {
    color: colors.textOnPrimary,
  },
  chart: {
    marginTop: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});