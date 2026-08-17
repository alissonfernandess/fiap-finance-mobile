import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    type PressableProps,
    type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/theme';

interface ButtonProps extends PressableProps {
  title: string;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        typeof style === 'function' ? style({ pressed }) : style as ViewStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} />
      ) : (
        <AppText style={styles.label}>{title}</AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },

  fullWidth: {
    width: '100%',
  },

  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },
});