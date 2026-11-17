import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/presentation/store/authStore';

export default function AuthLayout() {
  const { isAuthenticated, isUserLoaded } = useAuthStore();

  if (!isUserLoaded) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(private)/dashboard" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}