import { zodResolver } from '@hookform/resolvers/zod';
import {
    Controller,
    useForm,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { CategorySelector } from '@/components/forms/CategorySelector';
import { OperationSelector } from '@/components/forms/OperationSelector';
import {
    transactionSchema,
    type TransactionFormData,
} from '@/schemas/transactionSchema';

interface TransactionFormProps {
  initialValues?: Partial<TransactionFormData>;
  submitLabel?: string;
  onSubmit: (
    data: TransactionFormData,
  ) => void | Promise<void>;
}

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm({
  initialValues,
  submitLabel = 'Salvar transação',
  onSubmit,
}: TransactionFormProps) {
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

      <Button
        title={submitLabel}
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },

  button: {
    marginTop: 4,
  },
});