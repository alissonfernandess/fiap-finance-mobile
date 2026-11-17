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
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import {
  TransactionForm,
  type ReceiptFile,
} from '@/components/forms/TransactionForm';
import { useTransaction, useUpdateTransaction, useDeleteTransaction } from '@/presentation/hooks/useTransactions';
import { useUploadReceipt, useDeleteReceipt } from '@/presentation/hooks/useReceipts';
import type { TransactionFormData } from '@/schemas/transactionSchema';
import { colors } from '@/theme';

function convertDateToInput(date: string) {
  return date.split('/').reverse().join('-');
}

export default function EditarTransacaoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: transactionData, isLoading } = useTransaction(id);
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const uploadReceipt = useUploadReceipt();
  const deleteReceipt = useDeleteReceipt();

  if (isLoading) {
    return (
      <Screen style={styles.notFound}>
        <AppText variant="headline" align="center">Carregando transação...</AppText>
      </Screen>
    );
  }

  // Use type assertion after checking for null
  const transaction = transactionData!;
  if (!transactionData) {
    return (
      <Screen style={styles.notFound}>
        <AppText variant="headline" align="center">Transação não encontrada</AppText>
        <Button
          title="Voltar ao extrato"
          onPress={() => router.replace('/(private)/extrato')}
          style={styles.backButton}
        />
      </Screen>
    );
  }

  const currentReceiptUrl = transaction.receiptUrl;

  async function handleSubmit(
    data: TransactionFormData,
    receiptFile?: ReceiptFile,
    removeExistingReceipt = false,
  ) {
    const numericValue = Number(data.amount.replace(/\./g, '').replace(',', '.'));
    const formattedDate = data.date.split('-').reverse().join('/');

    let uploadedReceiptUrl: string | undefined;

    try {
      if (receiptFile) {
        const uploadResult = await uploadReceipt.mutateAsync({
          transactionId: transaction.id,
          file: receiptFile,
        });
        uploadedReceiptUrl = uploadResult.url;
      }

      const receiptUpdate: { receiptUrl?: string | null } = {};

      if (uploadedReceiptUrl) {
        receiptUpdate.receiptUrl = uploadedReceiptUrl;
      } else if (removeExistingReceipt) {
        receiptUpdate.receiptUrl = null;
      }

      await updateTransaction.mutateAsync({
        id: transaction.id,
        data: {
          description: data.description.trim(),
          value: Math.round(numericValue * 100),
          operation: data.operation,
          category: data.category,
          date: formattedDate,
          type: data.operation === 'income' ? 'deposito' : 'boleto',
          ...receiptUpdate,
        },
      });

      if (currentReceiptUrl && (uploadedReceiptUrl || removeExistingReceipt)) {
        try {
          await deleteReceipt.mutateAsync(currentReceiptUrl);
        } catch (cleanupError) {
          console.error('Erro ao remover comprovante antigo:', cleanupError);
        }
      }

      Alert.alert('Transação atualizada', 'As alterações foram salvas.');
      router.replace('/(private)/extrato');
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);

      if (uploadedReceiptUrl) {
        try {
          await deleteReceipt.mutateAsync(uploadedReceiptUrl);
        } catch (cleanupError) {
          console.error('Erro ao remover novo comprovante:', cleanupError);
        }
      }

      Alert.alert('Não foi possível atualizar', 'Verifique sua conexão e tente novamente.');
    }
  }

  async function confirmDelete() {
    try {
      await deleteTransaction.mutateAsync(transaction.id);

      if (currentReceiptUrl) {
        try {
          await deleteReceipt.mutateAsync(currentReceiptUrl);
        } catch (storageError) {
          console.error('Erro ao excluir comprovante:', storageError);
        }
      }

      router.replace('/(private)/extrato');
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      Alert.alert('Não foi possível excluir', 'Verifique sua conexão e tente novamente.');
    }
  }

  function handleDelete() {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Deseja realmente excluir esta transação?');
      if (confirmed) confirmDelete();
      return;
    }

    Alert.alert(
      'Excluir transação',
      'Essa ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: confirmDelete },
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
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back-outline" size={24} color={colors.textPrimary} />
        </Pressable>

        <AppText variant="headline">Editar transação</AppText>

        <View style={styles.headerButton} />
      </View>

      <TransactionForm
        submitLabel="Salvar alterações"
        initialReceiptUrl={transaction.receiptUrl}
        initialValues={{
          description: transaction.description,
          amount: (transaction.value / 100).toFixed(2).replace('.', ','),
          operation: transaction.operation,
          category: transaction.category,
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