import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { queryKeys } from '../../data/cache/queryKeys';
import {
  LoginUseCase,
  RegisterUseCase,
  LogoutUseCase,
  GetCurrentUserUseCase,
  SubscribeToAuthChangesUseCase,
} from '../../domain/use-cases/auth';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import type { LoginCredentials, RegisterData, User } from '../../domain/entities';
import { useEffect } from 'react';

// Initialize use cases
const authRepository = new AuthRepositoryImpl();
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
const subscribeToAuthChangesUseCase = new SubscribeToAuthChangesUseCase(authRepository);

export function useAuth() {
  const { user, tokens, isAuthenticated, isLoading, setUser, setTokens, setLoading, logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();

  // Subscribe to auth changes on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuthChangesUseCase.execute(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setTokens(await authRepository.getStoredTokens());
      } else {
        setUser(null);
        setTokens(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setTokens, setLoading]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUseCase.execute(credentials),
    onSuccess: ({ user, tokens }) => {
      setUser(user);
      setTokens(tokens);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => registerUseCase.execute(data),
    onSuccess: ({ user, tokens }) => {
      setUser(user);
      setTokens(tokens);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutUseCase.execute(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
    },
  });

  const refreshUser = async () => {
    const currentUser = await getCurrentUserUseCase.execute();
    if (currentUser) {
      setUser(currentUser);
    }
    return currentUser;
  };

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refreshUser,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}