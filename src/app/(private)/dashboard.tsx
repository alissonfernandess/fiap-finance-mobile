import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/common/Screen';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { SideMenu } from '@/components/navigation/SideMenu';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useTransactions } from '@/contexts/TransactionContext';
import { useUser } from '@/contexts/UserContext';
import { colors } from '@/theme';
import { calculateFinancialSummary } from '@/utils/calculateFinancialSummary';

export default function DashboardScreen() {
  const router = useRouter();
  const { transactions } = useTransactions();
  const { userName } = useUser();

  const [isMenuVisible, setIsMenuVisible] =
    useState(false);

  const recentTransactions = transactions.slice(0, 3);

  const {
  totalIncome,
  totalExpense,
  balance,
  
} = calculateFinancialSummary(transactions);
  function handleOpenMenu() {
    setIsMenuVisible(true);
  }

  function handleOpenStatement() {
    router.push('/(private)/extrato');
  }

  function handleTransactionPress(
    transactionId: string,
  ) {
    router.push({
      pathname: '/(private)/transacao/[id]',
      params: {
        id: transactionId,
      },
    });
  }

  return (
    <>
      <Screen scrollable style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir menu"
            hitSlop={12}
            onPress={handleOpenMenu}
            style={({ pressed }) => [
              styles.menuButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="menu-outline"
              size={26}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>

        <BalanceCard
          userName={userName || 'Usuário'}
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <View style={styles.statementHeader}>
          <AppText variant="headline">
            Extrato
          </AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver extrato completo"
            onPress={handleOpenStatement}
          >
            <AppText color={colors.textSecondary}>
              Ver todos
            </AppText>
          </Pressable>
        </View>

        <View style={styles.transactionList}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() =>
                  handleTransactionPress(
                    transaction.id,
                  )
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="receipt-outline"
                size={32}
                color={colors.textMuted}
              />

              <AppText
                color={colors.textSecondary}
                align="center"
                style={styles.emptyText}
              >
                Nenhuma transação cadastrada.
              </AppText>
            </View>
          )}
        </View>
      </Screen>

      <SideMenu
        visible={isMenuVisible}
        onClose={() =>
          setIsMenuVisible(false)
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingTop: 16,
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

  statementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },

  transactionList: {
    marginTop: 8,
  },

  emptyState: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  emptyText: {
    marginTop: 12,
  },

  pressed: {
    opacity: 0.7,
  },
});