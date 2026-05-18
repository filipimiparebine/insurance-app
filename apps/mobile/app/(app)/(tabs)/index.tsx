import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import FadeInView from '../../../src/components/FadeInView';
import AnimatedPressable from '../../../src/components/AnimatedPressable';
import { useLocale } from '../../../src/lib/LocaleProvider';

export default function HomeTab() {
  const { user } = useUser();
  const { t } = useLocale();

  return (
    <View style={styles.container}>
      <FadeInView>
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('dashboard.greeting', { name: user?.firstName ?? '' })}</Text>
          <Text style={styles.subtitle}>{t('dashboard.what_today')}</Text>
        </View>
      </FadeInView>

      <FadeInView delay={100}>
        <AnimatedPressable>
          <Pressable style={styles.primaryCard} onPress={() => router.push('/quote/step-1')}>
            <Text style={styles.cardIcon}>🚗</Text>
            <Text style={styles.primaryCardTitle}>{t('dashboard.new_rca')}</Text>
            <Text style={styles.primaryCardDesc}>{t('dashboard.new_rca_desc')}</Text>
          </Pressable>
        </AnimatedPressable>
      </FadeInView>

      <FadeInView delay={180}>
        <AnimatedPressable>
          <Pressable style={styles.card} onPress={() => router.push('/polite')}>
            <Text style={styles.cardIcon}>📋</Text>
            <Text style={styles.cardTitle}>{t('dashboard.policies')}</Text>
            <Text style={styles.cardDesc}>{t('dashboard.my_policies_desc')}</Text>
          </Pressable>
        </AnimatedPressable>
      </FadeInView>

      <FadeInView delay={260}>
        <AnimatedPressable>
          <Pressable style={styles.card} onPress={() => router.push('/profil')}>
            <Text style={styles.cardIcon}>👤</Text>
            <Text style={styles.cardTitle}>{t('dashboard.profile')}</Text>
            <Text style={styles.cardDesc}>{t('dashboard.my_profile_desc')}</Text>
          </Pressable>
        </AnimatedPressable>
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20 },
  header: { marginBottom: 24, paddingTop: 8 },
  greeting: { fontSize: 24, fontWeight: '600', color: '#0A0A0F' },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  primaryCard: {
    backgroundColor: '#0A0A0F',
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
  },
  primaryCardTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
  primaryCardDesc: { fontSize: 14, color: '#9ca3af', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardIcon: { fontSize: 28, marginBottom: 6 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: '#111827' },
  cardDesc: { fontSize: 14, color: '#6b7280', marginTop: 2 },
});
