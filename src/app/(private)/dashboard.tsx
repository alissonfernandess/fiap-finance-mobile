import { StyleSheet } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/common/Screen';

export default function DashboardScreen() {
  return (
    <Screen style={styles.container}>
      <AppText variant="title">
        Dashboard
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});