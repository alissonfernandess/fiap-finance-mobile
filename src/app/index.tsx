import { Redirect } from 'expo-router';
import { useAuthStore } from '@/presentation/store/authStore';

export default function Index() {
  const { isAuthenticated, isUserLoaded } = useAuthStore();

  if (!isUserLoaded) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(private)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}