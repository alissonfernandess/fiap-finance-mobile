import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initializeFirebase } from '@/infrastructure/firebase/config';
import { useAuthStore } from '@/presentation/store/authStore';
import { useAuth } from '@/presentation/hooks/useAuth';
import { colors } from '@/theme';

export function RootContent() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  const { isLoading: authLoading, refreshUser } = useAuth();
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    initializeFirebase();
  }, []);

  useEffect(() => {
    if (!authLoading) {
      refreshUser();
    }
  }, [authLoading, refreshUser]);

  useEffect(() => {
    setLoading(authLoading);
  }, [authLoading, setLoading]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    />
  );
}