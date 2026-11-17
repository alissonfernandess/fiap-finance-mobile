import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, AuthTokens } from '@/domain/entities';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUserLoaded: boolean;
  biometricEnabled: boolean;
  
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  setUserLoaded: (loaded: boolean) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      isUserLoaded: false,
      biometricEnabled: false,

      setUser: (user) => set({ user, isAuthenticated: !!user, isUserLoaded: true }),
      setTokens: (tokens) => set({ tokens }),
      setLoading: (isLoading) => set({ isLoading }),
      setUserLoaded: (isUserLoaded) => set({ isUserLoaded }),
      setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
      logout: () => set({ user: null, tokens: null, isAuthenticated: false, isUserLoaded: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        biometricEnabled: state.biometricEnabled,
      }),
    },
  ),
);