import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function IndexRedirect() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/landing" />;
}
