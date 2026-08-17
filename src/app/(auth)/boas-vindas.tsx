import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Screen } from '@/components/common/Screen';
import { colors } from '@/theme';

export default function BoasVindasScreen() {
  const router = useRouter();

  const { name } = useLocalSearchParams<{
    name?: string;
  }>();

  const firstName =
    typeof name === 'string' && name.trim()
      ? name.trim().split(' ')[0]
      : 'Felipe';

    function handleContinue() {
        router.replace('/(private)/dashboard');
    }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/BackgroundCadastro.png')}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      />

      <Screen
        backgroundColor="transparent"
        style={styles.screen}
      >
        <View style={styles.card}>
          <AppText
            variant="headline"
            color={colors.background}
            align="center"
          >
            Bem-vindo, {firstName}
          </AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continuar"
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.circleButton,
              pressed && styles.pressed,
            ]}
          >
            <AppText style={styles.arrow}>
              ›
            </AppText>
          </Pressable>

          <AppText
            color={colors.background}
            align="center"
            style={styles.continueText}
          >
            Continuar
          </AppText>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },

  screen: {
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },

  card: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderRadius: 16,
    backgroundColor: colors.whiteOverlay,
  },

  circleButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 26,
    backgroundColor: colors.surface,
  },

  arrow: {
    fontSize: 32,
    lineHeight: 34,
    color: colors.textPrimary,
  },

  continueText: {
    marginTop: 12,
  },

  pressed: {
    opacity: 0.8,
  },
});