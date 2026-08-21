import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors, fontFamily } from '@/theme';

interface BalanceCardProps {
  userName: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function BalanceCard({
  userName,
  balance,
  totalIncome,
  totalExpense,
}: BalanceCardProps) {
  const [isHidden, setIsHidden] = useState(false);

  function displayValue(value: number) {
    return isHidden
      ? '••••••'
      : formatCurrency(value);
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/BalanceCardBackground.png')}
      resizeMode="cover"
      imageStyle={styles.backgroundImage}
      style={styles.card}
    >
      <AppText style={styles.greeting}>
        Olá, {userName}
      </AppText>

      <AppText
        color={colors.textSecondary}
        style={styles.label}
      >
        Saldo em conta
      </AppText>

      <View style={styles.balanceRow}>
        <AppText variant="headline">
          {displayValue(balance)}
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isHidden
              ? 'Mostrar valores'
              : 'Ocultar valores'
          }
          hitSlop={12}
          onPress={() =>
            setIsHidden((current) => !current)
          }
          style={({ pressed }) => [
            styles.eyeButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name={
              isHidden
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <View style={styles.divider} />

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryLabel}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={18}
              color={colors.income}
            />

            <AppText color={colors.textSecondary}>
              Receitas
            </AppText>
          </View>

          <AppText
            color={colors.income}
            style={styles.summaryValue}
          >
            {displayValue(totalIncome)}
          </AppText>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.summaryItem}>
          <View style={styles.summaryLabel}>
            <Ionicons
              name="arrow-down-circle-outline"
              size={18}
              color={colors.expense}
            />

            <AppText color={colors.textSecondary}>
              Despesas
            </AppText>
          </View>

          <AppText
            color={colors.expense}
            style={styles.summaryValue}
          >
            {displayValue(totalExpense)}
          </AppText>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    borderRadius: 16,
  },

  card: {
    minHeight: 230,
    overflow: 'hidden',
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },

  greeting: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 22,
  },

  label: {
    marginTop: 16,
  },

  balanceRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  eyeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    marginTop: 8,
    backgroundColor: colors.textPrimary,
    opacity: 0.25,
  },

  summaryRow: {
    flexDirection: 'row',
    marginTop: 18,
  },

  summaryItem: {
    flex: 1,
  },

  summaryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  summaryValue: {
    marginTop: 6,
    fontFamily: fontFamily.bold,
  },

  verticalDivider: {
    width: 1,
    marginHorizontal: 14,
    backgroundColor: colors.textPrimary,
    opacity: 0.25,
  },

  pressed: {
    opacity: 0.7,
  },
});