import { Redirect, Stack } from 'expo-router';

import { useUser } from '@/contexts/UserContext';

export default function PrivateLayout() {
  const {
  isAuthenticated,
  isUserLoaded,
} = useUser();

  if (!isUserLoaded) {
    return null;
  }

 if (!isAuthenticated) {
    return (
      <Redirect href="/(auth)/login" />
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}