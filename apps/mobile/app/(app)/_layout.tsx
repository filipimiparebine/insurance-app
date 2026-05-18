import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { usePushNotifications } from '../../src/hooks/usePushNotifications';

export default function AppLayout() {
  const { isSignedIn } = useAuth();

  usePushNotifications();

  if (!isSignedIn) {
    return <Redirect href="/landing" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="politica" />
    </Stack>
  );
}
