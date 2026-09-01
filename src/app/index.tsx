import { Redirect } from 'expo-router';

import { useUser } from '@/contexts/UserContext';

export default function Index() {
  const { userName, isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return null;
  }

  if (userName) {
    return (
      <Redirect href="/(private)/dashboard" />
    );
  }

 return <Redirect href="/(auth)/login" />;
}