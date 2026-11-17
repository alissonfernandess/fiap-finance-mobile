import * as Crypto from 'expo-crypto';
import { SecureStorage } from '@/data/datasources/local/SecureStorage';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

export class EncryptionService {
  private static async getOrCreateKey(): Promise<CryptoKey> {
    let keyBase64 = await SecureStorage.getItem('encryption_master_key');
    
    if (!keyBase64) {
      const key = await Crypto.getRandomBytesAsync(KEY_LENGTH / 8);
      keyBase64 = btoa(String.fromCharCode(...key));
      await SecureStorage.setItem('encryption_master_key', keyBase64);
    }

    const keyData = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey(
      'raw',
      keyData,
      { name: ALGORITHM },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  static async encrypt(data: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const iv = await Crypto.getRandomBytesAsync(IV_LENGTH);
    const ivArray = new Uint8Array(iv);
    
    const encodedData = new TextEncoder().encode(data);
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv: ivArray },
      key,
      encodedData,
    );

    const combined = new Uint8Array(ivArray.length + encrypted.byteLength);
    combined.set(ivArray);
    combined.set(new Uint8Array(encrypted), ivArray.length);
    
    return btoa(String.fromCharCode(...combined));
  }

  static async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getOrCreateKey();
    const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
    
    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data,
    );

    return new TextDecoder().decode(decrypted);
  }

  static async encryptObject<T>(obj: T): Promise<string> {
    return this.encrypt(JSON.stringify(obj));
  }

  static async decryptObject<T>(encryptedData: string): Promise<T> {
    const decrypted = await this.decrypt(encryptedData);
    return JSON.parse(decrypted);
  }
}

export class SensitiveDataEncryption {
  static async encryptToken(token: string): Promise<string> {
    return EncryptionService.encrypt(token);
  }

  static async decryptToken(encryptedToken: string): Promise<string> {
    return EncryptionService.decrypt(encryptedToken);
  }

  static async encryptCredentials(credentials: Record<string, string>): Promise<string> {
    return EncryptionService.encryptObject(credentials);
  }

  static async decryptCredentials<T extends Record<string, string>>(encryptedData: string): Promise<T> {
    return EncryptionService.decryptObject<T>(encryptedData);
  }
}