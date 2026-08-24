import { useRouter } from 'expo-router';
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

export default function CadastroScreen() {
  const router = useRouter();
  const { saveUserName } = useUser();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleContinue() {
    const formattedName = name.trim();

    if (!formattedName || !phone.trim()) {
      return;
    }

    try {
      setIsSaving(true);

      await saveUserName(formattedName);

      router.push({
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
        'Tente cadastrar sua conta novamente.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/BackgroundCadastro.png')}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
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

          <Button
            title={
              isSaving
                ? 'Salvando...'
                : 'Continuar'
            }
            onPress={handleContinue}
            disabled={
              !name.trim() ||
              !phone.trim() ||
              isSaving
            }
            style={styles.button}
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

  button: {
    marginTop: 24,
  },
});