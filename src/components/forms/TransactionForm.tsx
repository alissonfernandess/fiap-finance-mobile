import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import {
  Controller,
  useForm,
} from 'react-hook-form';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { CategorySelector } from '@/components/forms/CategorySelector';
import { OperationSelector } from '@/components/forms/OperationSelector';
import {
  transactionSchema,
  type TransactionFormData,
} from '@/schemas/transactionSchema';
import { colors } from '@/theme';

export interface ReceiptFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

interface TransactionFormProps {
  initialValues?: Partial<TransactionFormData>;
  initialReceiptUrl?: string;
  submitLabel?: string;

  onSubmit: (
    data: TransactionFormData,
    receiptFile?: ReceiptFile,
    removeExistingReceipt?: boolean,
  ) => void | Promise<void>;
}

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm({
  initialValues,
  initialReceiptUrl,
  submitLabel = 'Salvar transação',
  onSubmit,
}: TransactionFormProps) {
  const [receiptFile, setReceiptFile] =
    useState<ReceiptFile>();

  const [
    removeExistingReceipt,
    setRemoveExistingReceipt,
  ] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: '',
      operation: 'expense',
      date: getCurrentDate(),
      ...initialValues,
    },
  });

  async function handleSelectReceipt() {
    try {
      const result =
        await DocumentPicker.getDocumentAsync({
          type: [
            'image/jpeg',
            'image/png',
            'application/pdf',
          ],
          copyToCacheDirectory: true,
          multiple: false,
        });

      if (result.canceled) {
        return;
      }

      const selectedFile = result.assets[0];
      const maximumSize = 5 * 1024 * 1024;

      if (
        selectedFile.size &&
        selectedFile.size > maximumSize
      ) {
        Alert.alert(
          'Arquivo muito grande',
          'Escolha um arquivo de até 5 MB.',
        );

        return;
      }

      setReceiptFile({
        uri: selectedFile.uri,
        name: selectedFile.name,
        mimeType:
          selectedFile.mimeType ?? undefined,
        size: selectedFile.size,
      });

      setRemoveExistingReceipt(false);
    } catch (error) {
      console.error(
        'Erro ao selecionar comprovante:',
        error,
      );

      Alert.alert(
        'Não foi possível selecionar',
        'Tente escolher o arquivo novamente.',
      );
    }
  }

  async function handleOpenReceipt() {
    if (!initialReceiptUrl) {
      return;
    }

    try {
      await Linking.openURL(
        initialReceiptUrl,
      );
    } catch (error) {
      console.error(
        'Erro ao abrir comprovante:',
        error,
      );

      Alert.alert(
        'Não foi possível abrir',
        'Tente novamente mais tarde.',
      );
    }
  }

  function handleRemoveReceipt() {
    setReceiptFile(undefined);

    if (initialReceiptUrl) {
      setRemoveExistingReceipt(true);
    }
  }

  const hasExistingReceipt =
    Boolean(initialReceiptUrl) &&
    !removeExistingReceipt &&
    !receiptFile;

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="operation"
        render={({ field }) => (
          <OperationSelector
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Input
            label="Descrição"
            placeholder="Ex.: Conta de energia"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.description?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field }) => (
          <Input
            label="Valor"
            placeholder="0,00"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            keyboardType="decimal-pad"
            error={errors.amount?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <CategorySelector
            value={field.value}
            onChange={field.onChange}
            error={errors.category?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <Input
            label="Data"
            placeholder="AAAA-MM-DD"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            error={errors.date?.message}
          />
        )}
      />

      <View style={styles.receiptContainer}>
        <AppText>
          Comprovante (opcional)
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Selecionar comprovante"
          onPress={handleSelectReceipt}
          style={({ pressed }) => [
            styles.receiptButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="attach-outline"
            size={22}
            color={colors.textPrimary}
          />

          <AppText>
            {receiptFile
              ? 'Trocar comprovante'
              : 'Anexar comprovante'}
          </AppText>
        </Pressable>

        {receiptFile && (
          <View style={styles.selectedFile}>
            <AppText style={styles.fileName}>
              {receiptFile.name}
            </AppText>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remover comprovante"
              onPress={handleRemoveReceipt}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color={colors.expense}
              />
            </Pressable>
          </View>
        )}

        {hasExistingReceipt && (
          <View style={styles.selectedFile}>
            <AppText style={styles.fileName}>
              Comprovante anexado
            </AppText>

            <View style={styles.fileActions}>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Abrir comprovante"
                onPress={handleOpenReceipt}
              >
                <Ionicons
                  name="open-outline"
                  size={22}
                  color={colors.textPrimary}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remover comprovante atual"
                onPress={handleRemoveReceipt}
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={colors.expense}
                />
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <Button
        title={submitLabel}
        loading={isSubmitting}
        onPress={handleSubmit((data) =>
          onSubmit(
            data,
            receiptFile,
            removeExistingReceipt,
          ),
        )}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },

  receiptContainer: {
    gap: 10,
  },

  receiptButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.textDisabled,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  selectedFile: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.whiteOverlay,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  fileName: {
    flex: 1,
  },

  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  button: {
    marginTop: 4,
  },

  pressed: {
    opacity: 0.7,
  },
});