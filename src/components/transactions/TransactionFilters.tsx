import { Ionicons } from '@expo/vector-icons';
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';



import { AppText } from '@/components/common/AppText';
import { colors, fontFamily } from '@/theme';
import type { TransactionOperation } from '@/types/transaction';

export type TransactionFilter =
  | 'all'
  | TransactionOperation;

interface TransactionFiltersProps {
  search: string;
  filter: TransactionFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: TransactionFilter) => void;
}

const filters: Array<{
  label: string;
  value: TransactionFilter;
}> = [
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

export function TransactionFilters({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: TransactionFiltersProps) {
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
          style={styles.searchInput}
        />

        {search.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
            hitSlop={10}
            onPress={() => onSearchChange('')}
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
        {filters.map((item) => {
          const isActive = filter === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => onFilterChange(item.value)}
              style={({ pressed }) => [
                styles.filterChip,
                isActive && styles.activeFilter,
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
    backgroundColor: colors.backgroundSecondary,
  },

  activeFilter: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight,
  },

  pressed: {
    opacity: 0.7,
  },
});