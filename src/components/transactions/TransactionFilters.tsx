import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import {
  transactionCategories,
  type TransactionCategory,
} from '@/schemas/transactionSchema';
import { colors, fontFamily } from '@/theme';
import type {
  TransactionOperation,
} from '@/types/transaction';

export type TransactionFilter =
  | 'all'
  | TransactionOperation;

export type CategoryFilter =
  | 'all'
  | TransactionCategory;

interface TransactionFiltersProps {
  search: string;
  filter: TransactionFilter;
  categoryFilter: CategoryFilter;
  startDate: string;
  endDate: string;

  onSearchChange: (value: string) => void;

  onFilterChange: (
    filter: TransactionFilter,
  ) => void;

  onCategoryFilterChange: (
    category: CategoryFilter,
  ) => void;

  onStartDateChange: (
    value: string,
  ) => void;

  onEndDateChange: (
    value: string,
  ) => void;

  onClearAdvancedFilters: () => void;
}

const operationFilters: {
  label: string;
  value: TransactionFilter;
}[] = [
  {
    label: 'Todos',
    value: 'all',
  },
  {
    label: 'Receitas',
    value: 'income',
  },
  {
    label: 'Despesas',
    value: 'expense',
  },
];

const categoryFilters: {
  label: string;
  value: CategoryFilter;
}[] = [
  {
    label: 'Todas',
    value: 'all',
  },
  ...transactionCategories.map(
    (category) => ({
      label: category,
      value: category,
    }),
  ),
];

export function TransactionFilters({
  search,
  filter,
  categoryFilter,
  startDate,
  endDate,
  onSearchChange,
  onFilterChange,
  onCategoryFilterChange,
  onStartDateChange,
  onEndDateChange,
  onClearAdvancedFilters,
}: TransactionFiltersProps) {
  const hasAdvancedFilters =
    categoryFilter !== 'all' ||
    Boolean(startDate) ||
    Boolean(endDate);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textMuted}
        />

        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Buscar transação"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          returnKeyType="search"
          accessibilityLabel="Buscar transação"
          style={styles.searchInput}
        />

        {search.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
            hitSlop={10}
            onPress={() => {
              onSearchChange('');
            }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {operationFilters.map((item) => {
          const isActive =
            filter === item.value;

          return (
            <Pressable
              key={item.value}
              accessibilityRole="button"
              accessibilityState={{
                selected: isActive,
              }}
              onPress={() => {
                onFilterChange(item.value);
              }}
              style={({ pressed }) => [
                styles.filterChip,
                isActive &&
                  styles.activeFilter,
                pressed && styles.pressed,
              ]}
            >
              <AppText
                color={
                  isActive
                    ? colors.textPrimary
                    : colors.textSecondary
                }
              >
                {item.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        <AppText color={colors.textSecondary}>
          Categoria
        </AppText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.categoryContent
          }
        >
          {categoryFilters.map((item) => {
            const isActive =
              categoryFilter === item.value;

            return (
              <Pressable
                key={item.value}
                accessibilityRole="button"
                accessibilityState={{
                  selected: isActive,
                }}
                onPress={() => {
                  onCategoryFilterChange(
                    item.value,
                  );
                }}
                style={({ pressed }) => [
                  styles.categoryChip,
                  isActive &&
                    styles.activeFilter,
                  pressed && styles.pressed,
                ]}
              >
                <AppText
                  color={
                    isActive
                      ? colors.textPrimary
                      : colors.textSecondary
                  }
                >
                  {item.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <AppText color={colors.textSecondary}>
          Período
        </AppText>

        <View style={styles.dateRow}>
          <View style={styles.dateContainer}>
            <AppText
              color={colors.textSecondary}
              style={styles.dateLabel}
            >
              De
            </AppText>

            <TextInput
              value={startDate}
              onChangeText={onStartDateChange}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={
                colors.textMuted
              }
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              accessibilityLabel="Data inicial"
              style={styles.dateInput}
            />
          </View>

          <View style={styles.dateContainer}>
            <AppText
              color={colors.textSecondary}
              style={styles.dateLabel}
            >
              Até
            </AppText>

            <TextInput
              value={endDate}
              onChangeText={onEndDateChange}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={
                colors.textMuted
              }
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              accessibilityLabel="Data final"
              style={styles.dateInput}
            />
          </View>
        </View>
      </View>

      {hasAdvancedFilters && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpar filtros avançados"
          onPress={onClearAdvancedFilters}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="close-outline"
            size={18}
            color={colors.textSecondary}
          />

          <AppText color={colors.textSecondary}>
            Limpar categoria e período
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },

  searchContainer: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  searchInput: {
    flex: 1,
    height: 48,
    marginHorizontal: 10,
    padding: 0,
    color: colors.textPrimary,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },

  filterChip: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    borderRadius: 18,
    backgroundColor:
      colors.backgroundSecondary,
  },

  activeFilter: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight,
  },

  section: {
    marginTop: 16,
    gap: 8,
  },

  categoryContent: {
    gap: 8,
    paddingRight: 20,
  },

  categoryChip: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    borderRadius: 18,
    backgroundColor:
      colors.backgroundSecondary,
  },

  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },

  dateContainer: {
    flex: 1,
  },

  dateLabel: {
    marginBottom: 6,
  },

  dateInput: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    borderRadius: 8,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },

  clearButton: {
    minHeight: 40,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  pressed: {
    opacity: 0.7,
  },
});