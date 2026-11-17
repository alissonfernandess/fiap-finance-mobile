import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/common/Screen';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useCreateTransaction } from '@/presentation/hooks/useTransactions';
import { useUploadReceipt } from '@/presentation/hooks/useReceipts';
import { colors } from '@/theme';
import type { TransactionFormData } from '@/schemas/transactionSchema';

export default function NovaTransacaoScreen() {
  const router = useRouter();
  const createTransaction = useCreateTransaction();
  const uploadReceipt = useUploadReceipt();

  async function handleSubmit(
    data: TransactionFormData,
    receiptFile?: { uri: string; name: string; mimeType?: string; size?: number },
  ) {
    const numericValue = Number(data.amount.replace(/\./g, '').replace(',', '.'));

    let uploadedReceiptUrl: string | undefined;

    try {
      if (receiptFile) {
        const uploadResult = await uploadReceipt.mutateAsync({
          transactionId: 'temp', // Will be updated after transaction creation
          file: receiptFile,
        });
        uploadedReceiptUrl = uploadResult.url;
      }

      await createTransaction.mutateAsync({
        description: data.description.trim(),
        value: Math.round(numericValue * 100), // Convert to cents
        operation: data.operation,
        category: data.category,
        date: data.date,
        type: data.operation === 'income' ? 'deposito' : 'boleto',
        ...(uploadedReceiptUrl ? { receiptUrl: uploadedReceiptUrl } : {}),
      });

      Alert.alert(
        'Transação adicionada',
        receiptFile
          ? 'A transação e o comprovante foram salvos.'
          : 'A transação foi cadastrada com sucesso.',
      );

      router.replace('/(private)/extrato');
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);

      if (uploadedReceiptUrl) {
        // Cleanup orphaned receipt - would need deleteReceipt hook
        console.warn('Comprovante órfão deixado:', uploadedReceiptUrl);
      }

      Alert.alert('Não foi possível adicionar', 'Verifique sua conexão e tente novamente.');
    }
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

        <AppText variant="headline">Nova transação</AppText>

        <View style={styles.headerButton} />
      </View>

      <TransactionForm onSubmit={handleSubmit} submitLabel="Salvar transação" />
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