import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/common/Screen';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { transactions } from '@/mocks/transactions';
import { colors } from '@/theme';
import { useRouter } from 'expo-router';

const recentTransactions = transactions.slice(0, 3);

export default function DashboardScreen() {
  const router = useRouter();

  function handleOpenMenu() {
    console.log('Abrir menu');
  }

  function handleOpenStatement() {
    router.push('/(private)/extrato');
  }
  
  return (
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
        userName="Felipe"
        balance={2000}
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
        {recentTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onPress={() => {
              console.log('Transação:', transaction.id);
            }}
          />
        ))}
      </View>
    </Screen>
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

  pressed: {
    opacity: 0.7,
  },
});