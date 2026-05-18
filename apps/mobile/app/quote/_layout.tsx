import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocale } from '../../src/lib/LocaleProvider';

export default function QuoteLayout() {
  const { t } = useLocale();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#0A0A0F',
        headerTitleStyle: { fontWeight: '600', color: '#0A0A0F' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="step-1" options={{ title: t('wizard.step1') }} />
      <Stack.Screen name="step-2" options={{ title: t('wizard.step2') }} />
      <Stack.Screen name="step-3" options={{ title: t('wizard.step3') }} />
      <Stack.Screen name="step-4" options={{ title: t('wizard.step4') }} />
      <Stack.Screen name="payment" options={{ title: t('checkout.title'), presentation: 'modal' }} />
    </Stack>
  );
}
