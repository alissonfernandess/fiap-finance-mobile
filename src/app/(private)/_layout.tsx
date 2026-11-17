import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/presentation/store/authStore';
import { UserProvider } from '@/contexts/UserContext';

export default function PrivateLayout() {
  const { isAuthenticated, isUserLoaded } = useAuthStore();

  if (!isUserLoaded) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </UserProvider>
  );
}