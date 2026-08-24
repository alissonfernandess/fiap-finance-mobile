import { Redirect, Stack } from 'expo-router';

import { useUser } from '@/contexts/UserContext';

export default function PrivateLayout() {
  const { userName, isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return null;
  }

  if (!userName) {
    return (
      <Redirect href="/(auth)/cadastro" />
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