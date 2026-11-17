import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useAuthStore } from '@/presentation/store/authStore';

interface UserContextValue {
  firebaseUser: any;
  userName: string;
  isUserLoaded: boolean;
  isAuthenticated: boolean;
  registerUser: (name: string, phone: string, email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  saveUserName: (name: string) => Promise<void>;
  clearUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: PropsWithChildren) {
  const { user, isAuthenticated, isLoading, register, login, logout } = useAuth();
  const { isUserLoaded } = useAuthStore();

  const userName = user?.name ?? '';

  const value = useMemo<UserContextValue>(
    () => ({
      firebaseUser: user ?? null,
      userName,
      isUserLoaded,
      isAuthenticated,
      async registerUser(name, phone, email, password) {
        await register({ name, phone, email, password });
      },
      async loginUser(email, password) {
        await login({ email, password });
      },
      async saveUserName(name) {
        console.log('Save user name:', name);
      },
      async clearUser() {
        await logout();
      },
    }),
    [user, userName, isUserLoaded, isAuthenticated, register, login, logout],
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser deve ser usado dentro de UserProvider');
  }

  return context;
}