import { useEffect } from 'react';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';
import { tokenCache } from '../src/lib/token-cache';
import { LocaleProvider } from '../src/lib/LocaleProvider';
import { setAuthTokenProvider } from '../src/lib/orpc-client';
import { usePushNotifications } from '../src/hooks/usePushNotifications';
import { initQuoteForm } from '../src/lib/quote-state';

import { setApiAuthTokenProvider } from '../src/lib/api';

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
}

function AuthTokenInitializer({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    const provider = async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    };
    setAuthTokenProvider(provider);
    setApiAuthTokenProvider(provider);
  }, [getToken]);

  return <>{children}</>;
}

function PushNotificationInitializer({ children }: { children: React.ReactNode }) {
  usePushNotifications();
  return <>{children}</>;
}

export default function RootLayout() {
  useEffect(() => { initQuoteForm(); }, []);

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <AuthTokenInitializer>
          <PushNotificationInitializer>
            <StripeProvider publishableKey={stripePublishableKey ?? ''}>
              <LocaleProvider>
                <Slot />
              </LocaleProvider>
            </StripeProvider>
          </PushNotificationInitializer>
        </AuthTokenInitializer>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
