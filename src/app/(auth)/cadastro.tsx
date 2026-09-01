import { useRouter } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Screen } from '@/components/common/Screen';
import { useUser } from '@/contexts/UserContext';
import { colors } from '@/theme';

function getRegisterErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return 'Não foi possível criar sua conta.';
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';

    case 'auth/invalid-email':
      return 'Informe um e-mail válido.';

    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';

    case 'auth/operation-not-allowed':
      return 'Ative o login por e-mail e senha no Firebase.';

    case 'auth/network-request-failed':
      return 'Verifique sua conexão com a internet.';

    default:
      return 'Não foi possível criar sua conta.';
  }
}

export default function CadastroScreen() {
  const router = useRouter();
  const { registerUser } = useUser();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [isSaving, setIsSaving] =
    useState(false);

  const isFormInvalid =
    !name.trim() ||
    !phone.trim() ||
    !email.trim() ||
    password.length < 6;

  async function handleContinue() {
    const formattedName = name.trim();

    if (isFormInvalid) {
      return;
    }

    try {
      setIsSaving(true);

    await registerUser(
      formattedName,
      phone,
      email,
      password,
    );

      router.replace({
        pathname: '/boas-vindas',
        params: {
          name: formattedName,
        },
      });
    } catch (error) {
      console.error(
        'Erro ao cadastrar usuário:',
        error,
      );

      Alert.alert(
        'Não foi possível continuar',
        getRegisterErrorMessage(error),
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleOpenLogin() {
    router.replace('/(auth)/login');
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/BackgroundCadastro.png')}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />

      <Screen
        scrollable
        backgroundColor="transparent"
        style={styles.screen}
      >
        <View style={styles.card}>
          <AppText
            variant="headline"
            color={colors.background}
            align="center"
          >
            Cadastre sua conta
          </AppText>

          <Input
            label="Nome completo"
            placeholder="Digite seu nome"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            containerStyle={styles.firstInput}
          />

          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            containerStyle={styles.input}
          />

          <Input
            label="E-mail"
            placeholder="nome@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.input}
          />

          <Input
            label="Senha"
            placeholder="Mínimo de 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.input}
          />

          <Button
            title={
              isSaving
                ? 'Criando conta...'
                : 'Criar conta'
            }
            onPress={handleContinue}
            disabled={
              isFormInvalid || isSaving
            }
            style={styles.button}
          />

          <Button
            title="Já tenho uma conta"
            onPress={handleOpenLogin}
            disabled={isSaving}
            style={styles.loginButton}
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
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    paddingVertical: 32,
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

  button: {
    marginTop: 24,
  },

  loginButton: {
    marginTop: 12,
  },
});