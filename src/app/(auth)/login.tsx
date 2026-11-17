import { useRouter } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Screen } from '@/components/common/Screen';
import { useAuth } from '@/presentation/hooks/useAuth';
import { colors } from '@/theme';

function getLoginErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return 'Não foi possível entrar na sua conta.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'Informe um e-mail válido.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'E-mail ou senha incorretos.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Verifique sua conexão com a internet.';
    default:
      return 'Não foi possível entrar na sua conta.';
  }
}

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoginLoading, loginError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormInvalid = !email.trim() || !password;

  async function handleLogin() {
    if (isFormInvalid) return;

    try {
      await login({ email, password });
      router.replace('/(private)/dashboard');
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      Alert.alert('Não foi possível entrar', getLoginErrorMessage(error));
    }
  }

  function handleOpenRegister() {
    router.replace('/(auth)/cadastro');
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/BackgroundCadastro.png')}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />

      <Screen backgroundColor="transparent" style={styles.screen}>
        <View style={styles.card}>
          <AppText
            variant="headline"
            color={colors.background}
            align="center"
          >
            Entre na sua conta
          </AppText>

          <Input
            label="E-mail"
            placeholder="nome@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.firstInput}
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.input}
          />

          {loginError && (
            <AppText color={colors.expense} style={styles.errorText}>
              {getLoginErrorMessage(loginError)}
            </AppText>
          )}

          <Button
            title={isLoginLoading ? 'Entrando...' : 'Entrar'}
            onPress={handleLogin}
            disabled={isFormInvalid || isLoginLoading}
            style={styles.button}
          />

          <Button
            title="Criar uma conta"
            onPress={handleOpenRegister}
            disabled={isLoginLoading}
            style={styles.registerButton}
          />
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
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderRadius: 16,
    backgroundColor: colors.whiteOverlay,
  },
  firstInput: {
    marginTop: 32,
  },
  input: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
  },
  registerButton: {
    marginTop: 12,
  },
});