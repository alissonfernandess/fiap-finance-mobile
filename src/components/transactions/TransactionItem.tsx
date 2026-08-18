import { Ionicons } from '@expo/vector-icons';
import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors, fontFamily } from '@/theme';
import type {
    Transaction,
    TransactionType,
} from '@/types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

const transactionIcons: Record<
  TransactionType,
  keyof typeof Ionicons.glyphMap
> = {
  pix: 'swap-horizontal-outline',
  boleto: 'document-text-outline',
  saque: 'arrow-up-circle-outline',
  deposito: 'arrow-down-circle-outline',
  ted: 'repeat-outline',
  doc: 'repeat-outline',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function TransactionItem({
  transaction,
  onPress,
}: TransactionItemProps) {
  const isIncome = transaction.operation === 'income';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={transactionIcons[transaction.type]}
          size={18}
          color={colors.textPrimary}
        />
      </View>

      <View style={styles.information}>
        <AppText style={styles.description}>
          {transaction.description}
        </AppText>

        <AppText color={colors.textMuted}>
          {transaction.date}
        </AppText>
      </View>

      <AppText
        color={isIncome ? colors.income : colors.expense}
        style={styles.value}
      >
        {isIncome ? '+' : '-'} {formatCurrency(transaction.value)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },

  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  information: {
    flex: 1,
    marginHorizontal: 12,
  },

  description: {
    marginBottom: 4,
  },

  value: {
    fontFamily: fontFamily.bold,
  },

  pressed: {
    opacity: 0.7,
  },
});