import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from '../entities';

export interface IAuthRepository {
  /**
   * Sign in with email and password
   */
  login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }>;

  /**
   * Register new user
   */
  register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }>;

  /**
   * Sign out current user
   */
  logout(): Promise<void>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Refresh access token
   */
  refreshToken(): Promise<AuthTokens>;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Update user password
   */
  updatePassword(newPassword: string): Promise<void>;

  /**
   * Subscribe to auth state changes
   * Returns unsubscribe function
   */
  subscribeToAuthChanges(callback: (user: User | null) => void): () => void;
}