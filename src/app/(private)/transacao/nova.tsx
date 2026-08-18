import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/common/Screen';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useTransactions } from '@/contexts/TransactionContext';
import type { TransactionFormData } from '@/schemas/transactionSchema';
import { colors } from '@/theme';

export default function NovaTransacaoScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactions();

  async function handleSubmit(data: TransactionFormData) {
  const numericValue = Number(
    data.amount
      .replace(/\./g, '')
      .replace(',', '.'),
  );

  const formattedDate = data.date
    .split('-')
    .reverse()
    .join('/');

  addTransaction({
    description: data.description,
    value: numericValue,
    operation: data.operation,
    category: data.category,
    date: formattedDate,
    type:
      data.operation === 'income'
        ? 'deposito'
        : 'boleto',
  });

  Alert.alert(
    'Transação adicionada',
    'A transação foi cadastrada com sucesso.',
  );

  router.replace('/(private)/extrato');
}

  return (
    <Screen scrollable style={styles.screen}>
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
          Nova transação
        </AppText>

        <View style={styles.headerButton} />
      </View>

      <TransactionForm onSubmit={handleSubmit} />
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
    marginBottom: 20,
  },

  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressed: {
    opacity: 0.7,
  },
});