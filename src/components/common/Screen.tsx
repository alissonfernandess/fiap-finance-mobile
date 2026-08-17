import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/theme';

interface ScreenProps extends PropsWithChildren {
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

export function Screen({
  children,
  scrollable = false,
  style,
  backgroundColor = colors.background,
}: ScreenProps) {
  const safeAreaStyle = [
    styles.safeArea,
    { backgroundColor },
  ];

  if (scrollable) {
    return (
      <SafeAreaView style={safeAreaStyle}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            style,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={safeAreaStyle}>
      <View style={[styles.content, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});