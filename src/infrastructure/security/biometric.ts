import * as LocalAuthentication from 'expo-local-authentication';
import { SecureStorage } from '../../data/datasources/local/SecureStorage';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const BIOMETRIC_TYPE_KEY = 'biometric_type';

export type BiometricType = 'fingerprint' | 'face' | 'iris' | 'none';

export class BiometricAuth {
  static async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  static async getBiometricType(): Promise<BiometricType> {
    const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    if (supported.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'face';
    }
    if (supported.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'fingerprint';
    }
    if (supported.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'iris';
    }
    return 'none';
  }

  static async authenticate(promptMessage: string = 'Autentique para acessar o app'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Usar senha',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  }

  static async enableBiometric(): Promise<boolean> {
    const available = await this.isAvailable();
    if (!available) return false;

    const success = await this.authenticate('Ative a autenticação biométrica');
    if (success) {
      await SecureStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
      const type = await this.getBiometricType();
      await SecureStorage.setItem(BIOMETRIC_TYPE_KEY, type);
      return true;
    }
    return false;
  }

  static async disableBiometric(): Promise<void> {
    await SecureStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    await SecureStorage.removeItem(BIOMETRIC_TYPE_KEY);
  }

  static async isBiometricEnabled(): Promise<boolean> {
    const enabled = await SecureStorage.getItem(BIOMETRIC_ENABLED_KEY);
    return enabled === 'true';
  }

  static async getStoredBiometricType(): Promise<BiometricType> {
    const type = await SecureStorage.getItem(BIOMETRIC_TYPE_KEY);
    return (type as BiometricType) ?? 'none';
  }
}