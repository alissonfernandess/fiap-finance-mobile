import { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Screen } from '@/components/common/Screen';
import { colors } from '@/theme';
import { useRouter } from 'expo-router';


export default function CadastroScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  function handleContinue() {
    router.push({
      pathname: '/boas-vindas',
      params: {
        name: name.trim(),
      },
    });
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
            title="Continuar"
            onPress={handleContinue}
            disabled={!name.trim() || !phone.trim()}
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