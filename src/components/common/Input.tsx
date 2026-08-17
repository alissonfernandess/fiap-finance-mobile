import { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors, fontFamily } from '@/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      containerStyle,
      style,
      ...rest
    },
    ref,
  ) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <AppText style={styles.label}>
            {label}
          </AppText>
        )}

        <TextInput
          ref={ref}
          placeholderTextColor={colors.textDisabled}
          style={[
            styles.input,
            error ? styles.inputError : undefined,
            style,
          ]}
          {...rest}
        />

        {error && (
          <AppText
            color={colors.expense}
            style={styles.error}
          >
            {error}
          </AppText>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    marginBottom: 8,
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
    color: colors.black,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },

  inputError: {
    borderColor: colors.expense,
  },

  error: {
    marginTop: 6,
  },
});