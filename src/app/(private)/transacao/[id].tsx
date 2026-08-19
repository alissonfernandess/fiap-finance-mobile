import { Ionicons } from '@expo/vector-icons';
import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import {
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    View
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useTransactions } from '@/contexts/TransactionContext';
import type {
    TransactionCategory,
    TransactionFormData,
} from '@/schemas/transactionSchema';
import { colors } from '@/theme';

function convertDateToInput(date: string) {
  return date.split('/').reverse().join('-');
}

export default function EditarTransacaoScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const {
    transactions,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const transaction = transactions.find(
    (item) => item.id === id,
  );

  if (!transaction) {
    return (
      <Screen style={styles.notFound}>
        <AppText
          variant="headline"
          align="center"
        >
          Transação não encontrada
        </AppText>

        <Button
          title="Voltar ao extrato"
          onPress={() => {
            router.replace('/(private)/extrato');
          }}
          style={styles.backButton}
        />
      </Screen>
    );
  }

  const transactionId = transaction.id;

  async function handleSubmit(
    data: TransactionFormData,
  ) {
    const numericValue = Number(
      data.amount
        .replace(/\./g, '')
        .replace(',', '.'),
    );

    const formattedDate = data.date
      .split('-')
      .reverse()
      .join('/');

    updateTransaction(transactionId, {
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
      'Transação atualizada',
      'As alterações foram salvas.',
    );

    router.replace('/(private)/extrato');
  }

  function confirmDelete() {
  deleteTransaction(transactionId);
  router.replace('/(private)/extrato');
}

function handleDelete() {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(
      'Deseja realmente excluir esta transação?',
    );

    if (confirmed) {
      confirmDelete();
    }

    return;
  }

  Alert.alert(
    'Excluir transação',
    'Essa ação não poderá ser desfeita.',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: confirmDelete,
      },
    ],
  );
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
          Editar transação
        </AppText>

        <View style={styles.headerButton} />
      </View>

      <TransactionForm
        submitLabel="Salvar alterações"
        initialValues={{
          description: transaction.description,
          amount: transaction.value
            .toFixed(2)
            .replace('.', ','),
          operation: transaction.operation,
          category:
            (transaction.category as TransactionCategory) ??
            'Outros',
          date: convertDateToInput(transaction.date),
        }}
        onSubmit={handleSubmit}
      />

      <Button
        title="Excluir transação"
        onPress={handleDelete}
        style={styles.deleteButton}
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
    marginBottom: 20,
  },

  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButton: {
    marginTop: 16,
    borderColor: colors.expense,
    backgroundColor: colors.expense,
  },

  notFound: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    marginTop: 24,
  },

  pressed: {
    opacity: 0.7,
  },
});