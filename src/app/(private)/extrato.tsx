import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/common/Screen';
import {
    TransactionFilters,
    type TransactionFilter,
} from '@/components/transactions/TransactionFilters';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { transactions } from '@/mocks/transactions';
import { colors } from '@/theme';
import type { Transaction } from '@/types/transaction';

export default function ExtratoScreen() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [filter, setFilter] =
    useState<TransactionFilter>('all');

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLocaleLowerCase('pt-BR');

    return transactions.filter((transaction) => {
      const matchesSearch = transaction.description
        .toLocaleLowerCase('pt-BR')
        .includes(normalizedSearch);

      const matchesFilter =
        filter === 'all' ||
        transaction.operation === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  function handleTransactionPress(transaction: Transaction) {
    console.log('Transação selecionada:', transaction.id);
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>

        <AppText variant="headline">
          Extrato
        </AppText>

        <View style={styles.headerButton} />
      </View>

      <TransactionFilters
        search={search}
        filter={filter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(transaction) => transaction.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={() => handleTransactionPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="receipt-outline"
              size={40}
              color={colors.textMuted}
            />

            <AppText
              color={colors.textSecondary}
              align="center"
              style={styles.emptyText}
            >
              Nenhuma transação encontrada.
            </AppText>
          </View>
        }
      />
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

  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContent: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 24,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },

  emptyText: {
    marginTop: 12,
  },

  pressed: {
    opacity: 0.7,
  },
});