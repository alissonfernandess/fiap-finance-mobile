import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const ENCRYPTION_KEY_PREFIX = 'secure_';

export class SecureStorage {
  private static async getEncryptionKey(): Promise<string> {
    let key = await AsyncStorage.getItem('encryption_key');
    if (!key) {
      key = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${Date.now()}-${Math.random()}-${await Crypto.randomUUID()}`,
      );
      await AsyncStorage.setItem('encryption_key', key);
    }
    return key;
  }

  private static async encrypt(value: string): Promise<string> {
    const key = await this.getEncryptionKey();
    let result = '';
    for (let i = 0; i < value.length; i++) {
      result += String.fromCharCode(
        value.charCodeAt(i) ^ key.charCodeAt(i % key.length),
      );
    }
    return btoa(result);
  }

  private static async decrypt(encrypted: string): Promise<string> {
    const key = await this.getEncryptionKey();
    const decoded = atob(encrypted);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length),
      );
    }
    return result;
  }

  static async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this.encrypt(value);
    await AsyncStorage.setItem(`${ENCRYPTION_KEY_PREFIX}${key}`, encrypted);
  }

  static async getItem(key: string): Promise<string | null> {
    const encrypted = await AsyncStorage.getItem(`${ENCRYPTION_KEY_PREFIX}${key}`);
    if (!encrypted) return null;
    try {
      return await this.decrypt(encrypted);
    } catch {
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(`${ENCRYPTION_KEY_PREFIX}${key}`);
  }

  static async clear(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const secureKeys = keys.filter((k) => k.startsWith(ENCRYPTION_KEY_PREFIX));
    await AsyncStorage.multiRemove(secureKeys);
  }
}

export class CacheStorage {
  private static readonly CACHE_PREFIX = 'cache_';
  private static readonly CACHE_EXPIRY_PREFIX = 'cache_expiry_';

  static async setItem<T>(key: string, value: T, ttlMs: number = 5 * 60 * 1000): Promise<void> {
    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    const expiryKey = `${this.CACHE_EXPIRY_PREFIX}${key}`;
    
    await AsyncStorage.setItem(cacheKey, JSON.stringify(value));
    await AsyncStorage.setItem(expiryKey, String(Date.now() + ttlMs));
  }

  static async getItem<T>(key: string): Promise<T | null> {
    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    const expiryKey = `${this.CACHE_EXPIRY_PREFIX}${key}`;
    
    const [value, expiry] = await Promise.all([
      AsyncStorage.getItem(cacheKey),
      AsyncStorage.getItem(expiryKey),
    ]);

    if (!value || !expiry) return null;

    if (Date.now() > Number(expiry)) {
      await this.removeItem(key);
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    await AsyncStorage.multiRemove([
      `${this.CACHE_PREFIX}${key}`,
      `${this.CACHE_EXPIRY_PREFIX}${key}`,
    ]);
  }

  static async clear(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(
      (k) => k.startsWith(this.CACHE_PREFIX) || k.startsWith(this.CACHE_EXPIRY_PREFIX),
    );
    await AsyncStorage.multiRemove(cacheKeys);
  }

  static async getAllKeys(): Promise<string[]> {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter((k) => k.startsWith(this.CACHE_PREFIX));
  }
}