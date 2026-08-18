import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import {
    transactionCategories,
    type TransactionCategory,
} from '@/schemas/transactionSchema';
import { colors } from '@/theme';

interface CategorySelectorProps {
  value?: TransactionCategory;
  error?: string;
  onChange: (category: TransactionCategory) => void;
}

export function CategorySelector({
  value,
  error,
  onChange,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(category: TransactionCategory) {
    onChange(category);
    setIsOpen(false);
  }

  return (
    <View>
      <AppText>Categoria</AppText>

      <Pressable
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.selector,
          error ? styles.selectorError : undefined,
          pressed && styles.pressed,
        ]}
      >
        <AppText
          color={
            value
              ? colors.textPrimary
              : colors.textMuted
          }
        >
          {value ?? 'Selecione uma categoria'}
        </AppText>

        <Ionicons
          name="chevron-down-outline"
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>

      {error && (
        <AppText
          color={colors.expense}
          style={styles.error}
        >
          {error}
        </AppText>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsOpen(false)}
          />

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText variant="headline">
                Selecione a categoria
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar"
                onPress={() => setIsOpen(false)}
              >
                <Ionicons
                  name="close-outline"
                  size={26}
                  color={colors.textPrimary}
                />
              </Pressable>
            </View>

            <FlatList
              data={transactionCategories}
              keyExtractor={(category) => category}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item)}
                  style={({ pressed }) => [
                    styles.category,
                    value === item &&
                      styles.selectedCategory,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText>{item}</AppText>

                  {value === item && (
                    <Ionicons
                      name="checkmark-outline"
                      size={20}
                      color={colors.income}
                    />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  selectorError: {
    borderColor: colors.expense,
  },

  error: {
    marginTop: 6,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    maxHeight: '70%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.backgroundSecondary,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  category: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },

  selectedCategory: {
    backgroundColor: colors.surface,
  },

  pressed: {
    opacity: 0.7,
  },
});