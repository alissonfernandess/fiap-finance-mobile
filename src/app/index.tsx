import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance Mobile</Text>

      <Text style={styles.description}>
        Gerencie sua vida financeira.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },

  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  description: {
    ...typography.headlineSmall,
    marginTop: 8,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});