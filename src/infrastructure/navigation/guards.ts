import { useAuthStore } from '../../presentation/store/authStore';
import { BiometricAuth } from '../../infrastructure/security/biometric';

export class AuthGuard {
  static async canAccessPrivateRoute(): Promise<boolean> {
    const { isAuthenticated, isLoading } = useAuthStore.getState();
    
    if (isLoading) {
      // Wait for auth to initialize
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.canAccessPrivateRoute();
    }

    if (!isAuthenticated) {
      return false;
    }

    // Check if biometric is enabled and requires auth
    const biometricEnabled = await BiometricAuth.isBiometricEnabled();
    if (biometricEnabled) {
      const authenticated = await BiometricAuth.authenticate('Autentique para acessar o app');
      if (!authenticated) return false;
    }

    return true;
  }
}

export class GuestGuard {
  static async canAccessAuthRoute(): Promise<boolean> {
    const { isAuthenticated, isLoading } = useAuthStore.getState();
    
    if (isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.canAccessAuthRoute();
    }

    return !isAuthenticated;
  }
}