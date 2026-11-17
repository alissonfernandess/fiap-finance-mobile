import { SecureStorage } from '@/data/datasources/local/SecureStorage';
import { EncryptionService } from './encryption';

const TOKEN_KEY = 'auth_tokens';
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class TokenManager {
  static async storeTokens(tokens: StoredTokens): Promise<void> {
    const encrypted = await EncryptionService.encryptObject(tokens);
    await SecureStorage.setItem(TOKEN_KEY, encrypted);
  }

  static async getTokens(): Promise<StoredTokens | null> {
    const encrypted = await SecureStorage.getItem(TOKEN_KEY);
    if (!encrypted) return null;
    
    try {
      return await EncryptionService.decryptObject<StoredTokens>(encrypted);
    } catch {
      return null;
    }
  }

  static async clearTokens(): Promise<void> {
    await SecureStorage.removeItem(TOKEN_KEY);
  }

  static async getValidAccessToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    if (!tokens) return null;

    const now = Date.now();
    
    if (tokens.expiresAt - now > REFRESH_THRESHOLD_MS) {
      return tokens.accessToken;
    }

    return null;
  }

  static async isTokenExpired(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) return true;
    return tokens.expiresAt <= Date.now();
  }

  static calculateExpiry(expiresInSeconds: number): number {
    return Date.now() + expiresInSeconds * 1000;
  }
}