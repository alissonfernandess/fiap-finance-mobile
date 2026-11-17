import type { IAuthRepository } from '../../domain/repositories';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '../../domain/entities';
import { FirebaseAuthDataSource } from '../datasources/firebase/FirebaseAuthDataSource';
import { SecureStorage } from '../datasources/local/SecureStorage';

export class AuthRepositoryImpl implements IAuthRepository {
  private dataSource = new FirebaseAuthDataSource();
  private readonly TOKEN_KEY = 'auth_tokens';

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.dataSource.login(credentials);
    await this.storeTokens(result.tokens);
    return result;
  }

  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.dataSource.register(data);
    await this.storeTokens(result.tokens);
    return result;
  }

  async logout(): Promise<void> {
    await this.dataSource.logout();
    await SecureStorage.removeItem(this.TOKEN_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    return this.dataSource.getCurrentUser();
  }

  async refreshToken(): Promise<AuthTokens> {
    const tokens = await this.dataSource.refreshToken();
    await this.storeTokens(tokens);
    return tokens;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    return this.dataSource.sendPasswordResetEmail(email);
  }

  async updatePassword(newPassword: string): Promise<void> {
    return this.dataSource.updatePassword(newPassword);
  }

  subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
    return this.dataSource.subscribeToAuthChanges(callback);
  }

  async getStoredTokens(): Promise<AuthTokens | null> {
    const stored = await SecureStorage.getItem(this.TOKEN_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private async storeTokens(tokens: AuthTokens): Promise<void> {
    await SecureStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
  }
}