import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors, fontFamily } from '@/theme';

interface BalanceCardProps {
  userName: string;
  balance: number;
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
}: BalanceCardProps) {
  const [isHidden, setIsHidden] = useState(false);

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
          {isHidden ? '••••••••' : formatCurrency(balance)}
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isHidden ? 'Mostrar saldo' : 'Ocultar saldo'
          }
          hitSlop={12}
          onPress={() => setIsHidden((current) => !current)}
          style={({ pressed }) => [
            styles.eyeButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name={isHidden ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <View style={styles.divider} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

    backgroundImage: {
        borderRadius: 16,
    },

    card: {
        minHeight: 170,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
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
  },

  pressed: {
    opacity: 0.7,
  },
});