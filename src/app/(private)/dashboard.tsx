import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/common/Screen';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { SideMenu } from '@/components/navigation/SideMenu';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useFinancialSummary } from '@/presentation/hooks/useFinancialSummary';
import { useUIStore } from '@/presentation/store/uiStore';
import { useUser } from '@/contexts/UserContext';
import { colors } from '@/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const { summary, isLoading, transactions } = useFinancialSummary();
  const { isSideMenuOpen, closeSideMenu } = useUIStore();
  const { userName } = useUser();

  const [balanceAnimation] = useState(() => new Animated.Value(0));
  const [statementAnimation] = useState(() => new Animated.Value(0));

  const recentTransactions = transactions.slice(0, 3);

  useEffect(() => {
    let isMounted = true;

    async function startAnimations() {
      const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();

      if (!isMounted) return;

      if (reduceMotionEnabled) {
        balanceAnimation.setValue(1);
        statementAnimation.setValue(1);
        return;
      }

      Animated.stagger(140, [
        Animated.timing(balanceAnimation, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(statementAnimation, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }

    startAnimations();

    return () => {
      isMounted = false;
    };
  }, [balanceAnimation, statementAnimation]);

  function handleOpenMenu() {
    useUIStore.getState().openSideMenu();
  }

  function handleOpenStatement() {
    router.push('/(private)/extrato');
  }

  function handleTransactionPress(transactionId: string) {
    router.push({
      pathname: '/(private)/transacao/[id]',
      params: { id: transactionId },
    });
  }

  const balanceAnimatedStyle = {
    opacity: balanceAnimation,
    transform: [
      {
        translateY: balanceAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };

  const statementAnimatedStyle = {
    opacity: statementAnimation,
    transform: [
      {
        translateY: statementAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };

  if (isLoading) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.loadingContainer}>
          <AppText variant="headline">Carregando...</AppText>
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
            onPress={handleOpenMenu}
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          >
            <Ionicons name="menu-outline" size={26} color={colors.textPrimary} />
          </Pressable>
        </View>

        <Animated.View style={balanceAnimatedStyle}>
          <BalanceCard
            userName={userName || 'Usuário'}
            balance={summary.balance}
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense}
          />
        </Animated.View>

        <Animated.View style={statementAnimatedStyle}>
          <View style={styles.statementHeader}>
            <AppText variant="headline">Extrato</AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver extrato completo"
              onPress={handleOpenStatement}
            >
              <AppText color={colors.textSecondary}>Ver todos</AppText>
            </Pressable>
          </View>

          <View style={styles.transactionList}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction.id)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={32} color={colors.textMuted} />
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
        </Animated.View>
      </Screen>

      <SideMenu
        visible={isSideMenuOpen}
        onClose={closeSideMenu}
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