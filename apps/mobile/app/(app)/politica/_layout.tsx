import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/tokens';
import { useLocale } from '../../../src/lib/LocaleProvider';

export default function PoliticaLayout() {
  const { t } = useLocale();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.black,
        headerTitleStyle: { fontWeight: '600', color: colors.black },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: t('dashboard.policies'),
        }}
      />
    </Stack>
  );
}
