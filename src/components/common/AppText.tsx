import {
    Text,
    type TextProps,
    type TextStyle,
} from 'react-native';

import { colors, typography } from '@/theme';

type TypographyVariant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function AppText({
  variant = 'headlineSmall',
  color = colors.textPrimary,
  align = 'left',
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[
        typography[variant],
        {
          color,
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}