import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/theme';
import type { TransactionOperation } from '@/types/transaction';

interface OperationSelectorProps {
  value: TransactionOperation;
  onChange: (value: TransactionOperation) => void;
}

const operations: {
  label: string;
  value: TransactionOperation;
}[] = [
  {
    label: 'Receita',
    value: 'income',
  },
  {
    label: 'Despesa',
    value: 'expense',
  },
];

export function OperationSelector({
  value,
  onChange,
}: OperationSelectorProps) {
  return (
    <View>
      <AppText>Tipo da transação</AppText>

      <View style={styles.options}>
        {operations.map((operation) => {
          const isActive = value === operation.value;
          const activeColor =
            operation.value === 'income'
              ? colors.income
              : colors.expense;

          return (
            <Pressable
              key={operation.value}
              accessibilityRole="radio"
              accessibilityState={{
                checked: isActive,
              }}
              onPress={() => onChange(operation.value)}
              style={({ pressed }) => [
                styles.option,
                isActive && {
                  borderColor: activeColor,
                  backgroundColor: `${activeColor}20`,
                },
                pressed && styles.pressed,
              ]}
            >
              <AppText
                color={
                  isActive
                    ? activeColor
                    : colors.textSecondary
                }
              >
                {operation.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },

  option: {
    minHeight: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  pressed: {
    opacity: 0.7,
  },
});