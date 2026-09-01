import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  useMemo,
  useState,
} from 'react';
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
  type CategoryFilter,
  type TransactionFilter,
} from '@/components/transactions/TransactionFilters';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useTransactions } from '@/contexts/TransactionContext';
import { colors } from '@/theme';
import type { Transaction } from '@/types/transaction';

const PAGE_SIZE = 10;

function parseTransactionDate(date: string) {
  const [day, month, year] =
    date.split('/').map(Number);

  return new Date(
    year,
    month - 1,
    day,
  ).getTime();
}

function parseFilterDate(date: string) {
  if (date.length !== 10) {
    return undefined;
  }

  const timestamp = new Date(
    `${date}T00:00:00`,
  ).getTime();

  return Number.isNaN(timestamp)
    ? undefined
    : timestamp;
}

export default function ExtratoScreen() {
  const router = useRouter();

  const {
    transactions,
    isLoadingTransactions,
  } = useTransactions();

  const [search, setSearch] = useState('');

  const [filter, setFilter] =
    useState<TransactionFilter>('all');

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState<CategoryFilter>('all');

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  const [visibleCount, setVisibleCount] =
    useState(PAGE_SIZE);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    const startTimestamp =
      parseFilterDate(startDate);

    const endTimestamp =
      parseFilterDate(endDate);

    return transactions.filter(
      (transaction) => {
        const matchesSearch =
          transaction.description
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesOperation =
          filter === 'all' ||
          transaction.operation === filter;

        const matchesCategory =
          categoryFilter === 'all' ||
          transaction.category ===
            categoryFilter;

        const transactionTimestamp =
          parseTransactionDate(
            transaction.date,
          );

        const matchesStartDate =
          startTimestamp === undefined ||
          transactionTimestamp >=
            startTimestamp;

        const matchesEndDate =
          endTimestamp === undefined ||
          transactionTimestamp <=
            endTimestamp;

        return (
          matchesSearch &&
          matchesOperation &&
          matchesCategory &&
          matchesStartDate &&
          matchesEndDate
        );
      },
    );
  }, [
    transactions,
    search,
    filter,
    categoryFilter,
    startDate,
    endDate,
  ]);

  const visibleTransactions = useMemo(
    () =>
      filteredTransactions.slice(
        0,
        visibleCount,
      ),
    [
      filteredTransactions,
      visibleCount,
    ],
  );

  const hasMoreTransactions =
    visibleCount <
    filteredTransactions.length;

  function handleSearchChange(
    value: string,
  ) {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  }

  function handleFilterChange(
    value: TransactionFilter,
  ) {
    setFilter(value);
    setVisibleCount(PAGE_SIZE);
  }

  function handleCategoryChange(
    value: CategoryFilter,
  ) {
    setCategoryFilter(value);
    setVisibleCount(PAGE_SIZE);
  }

  function handleStartDateChange(
    value: string,
  ) {
    setStartDate(value);
    setVisibleCount(PAGE_SIZE);
  }

  function handleEndDateChange(
    value: string,
  ) {
    setEndDate(value);
    setVisibleCount(PAGE_SIZE);
  }

  function handleLoadMore() {
    if (!hasMoreTransactions) {
      return;
    }

    setVisibleCount((currentValue) =>
      Math.min(
        currentValue + PAGE_SIZE,
        filteredTransactions.length,
      ),
    );
  }

  function handleClearAdvancedFilters() {
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
    setVisibleCount(PAGE_SIZE);
  }

  function handleAddTransaction() {
    router.push(
      '/(private)/transacao/nova',
    );
  }

  function handleTransactionPress(
    transaction: Transaction,
  ) {
    router.push({
      pathname:
        '/(private)/transacao/[id]',
      params: {
        id: transaction.id,
      },
    });
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <AppText variant="headline">
          Extrato
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar transação"
          onPress={handleAddTransaction}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="add-outline"
            size={30}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <TransactionFilters
        search={search}
        filter={filter}
        categoryFilter={categoryFilter}
        startDate={startDate}
        endDate={endDate}
        onSearchChange={
          handleSearchChange
        }
        onFilterChange={
          handleFilterChange
        }
        onCategoryFilterChange={
          handleCategoryChange
        }
        onStartDateChange={
          handleStartDateChange
        }
        onEndDateChange={
          handleEndDateChange
        }
        onClearAdvancedFilters={
          handleClearAdvancedFilters
        }
      />

      <FlatList
        data={visibleTransactions}
        keyExtractor={(transaction) =>
          transaction.id
        }
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onPress={() => {
              handleTransactionPress(item);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.listContent
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          hasMoreTransactions ? (
            <View style={styles.listFooter}>
              <AppText
                color={colors.textSecondary}
                align="center"
              >
                Carregando mais transações...
              </AppText>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name={
                isLoadingTransactions
                  ? 'cloud-download-outline'
                  : 'receipt-outline'
              }
              size={40}
              color={colors.textMuted}
            />

            <AppText
              color={colors.textSecondary}
              align="center"
              style={styles.emptyText}
            >
              {isLoadingTransactions
                ? 'Carregando transações...'
                : 'Nenhuma transação encontrada.'}
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

  listFooter: {
    paddingVertical: 20,
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