import { Text, View, TouchableOpacity, ScrollView, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { useLocale } from '../../../src/lib/LocaleProvider';
import { api } from '../../../src/lib/api';
import { Button } from '../../../src/components';
import { colors, borderRadius } from '../../../src/theme/tokens';
import FadeInView from '../../../src/components/FadeInView';
import AnimatedPressable from '../../../src/components/AnimatedPressable';

interface Preferences {
  emailReminders: boolean
  smsReminders: boolean
  pushReminders: boolean
}

const DEFAULT_PREFS: Preferences = {
  emailReminders: true,
  smsReminders: true,
  pushReminders: true,
}

export default function ProfilTab() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    api.account.getProfile()
      .then((profile) => {
        const userPrefs = (profile.user as { preferences?: Preferences }).preferences
        if (userPrefs) {
          setPrefs({
            emailReminders: userPrefs.emailReminders ?? true,
            smsReminders: userPrefs.smsReminders ?? true,
            pushReminders: userPrefs.pushReminders ?? true,
          })
        }
      })
      .catch(() => {})
      .finally(() => setPrefsLoaded(true))
  }, [])

  function handleToggle(key: keyof Preferences, value: boolean) {
    const next = { ...prefs, [key]: value }
    setPrefs(next)

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      api.account.updatePreferences(next).catch(() => {})
    }, 500)
  }

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FadeInView>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.firstName?.[0] ?? 'U').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.firstName ?? ''} {user?.lastName ?? ''}</Text>
          <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress ?? ''}</Text>
        </View>
      </FadeInView>

      <FadeInView delay={80}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.account_info')}</Text>
          <ProfileRow label={t('owner.nume')} value={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`} />
          <ProfileRow label={t('owner.email')} value={user?.primaryEmailAddress?.emailAddress ?? '-'} />
          <ProfileRow label={t('owner.telefon')} value={user?.primaryPhoneNumber?.phoneNumber ?? '-'} />
        </View>
      </FadeInView>

      <FadeInView delay={160}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.actions')}</Text>
          <AnimatedPressable>
            <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/quote/step-1')}>
              <Text style={styles.actionText}>{t('dashboard.new_policy_action')}</Text>
            </TouchableOpacity>
          </AnimatedPressable>
          <AnimatedPressable>
            <TouchableOpacity style={styles.actionRow}>
              <Text style={styles.actionText}>{t('dashboard.my_data_action')}</Text>
            </TouchableOpacity>
          </AnimatedPressable>
        </View>
      </FadeInView>

      {prefsLoaded && (
        <FadeInView delay={180}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('preferences.title')}</Text>
            <Text style={styles.sectionSubtitle}>{t('preferences.subtitle')}</Text>
            <PrefRow
              label={t('preferences.emailReminders')}
              desc={t('preferences.emailRemindersDesc')}
              value={prefs.emailReminders}
              onToggle={(v) => handleToggle('emailReminders', v)}
              isFirst
            />
            <PrefRow
              label={t('preferences.smsReminders')}
              desc={t('preferences.smsRemindersDesc')}
              value={prefs.smsReminders}
              onToggle={(v) => handleToggle('smsReminders', v)}
            />
            <PrefRow
              label={t('preferences.pushReminders')}
              desc={t('preferences.pushRemindersDesc')}
              value={prefs.pushReminders}
              onToggle={(v) => handleToggle('pushReminders', v)}
              isLast
            />
          </View>
        </FadeInView>
      )}

      <FadeInView delay={200}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('common.language')}</Text>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, locale === 'ro' && styles.langBtnActive]}
              onPress={() => setLocale('ro')}
            >
              <Text style={[styles.langBtnText, locale === 'ro' && styles.langBtnTextActive]}>RO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, locale === 'en' && styles.langBtnActive]}
              onPress={() => setLocale('en')}
            >
              <Text style={[styles.langBtnText, locale === 'en' && styles.langBtnTextActive]}>EN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </FadeInView>

      <FadeInView delay={240}>
        <Button variant="ghost" onPress={() => signOut()} style={styles.signOutButton}>
          {t('dashboard.logout')}
        </Button>
      </FadeInView>
    </ScrollView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function PrefRow({
  label,
  desc,
  value,
  onToggle,
  isFirst,
  isLast,
}: {
  label: string
  desc: string
  value: boolean
  onToggle: (v: boolean) => void
  isFirst?: boolean
  isLast?: boolean
}) {
  return (
    <View style={[
      styles.prefRow,
      isFirst && styles.prefRowFirst,
      isLast && styles.prefRowLast,
    ]}>
      <View style={styles.prefTextCol}>
        <Text style={styles.prefLabel}>{label}</Text>
        <Text style={styles.prefDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.gray300, true: colors.orange }}
        thumbColor={value ? colors.white : colors.gray400}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray50 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.orange,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '600', color: colors.white },
  name: { fontSize: 22, fontWeight: '600', color: colors.gray700 },
  email: { fontSize: 14, color: colors.gray500, marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.gray700, marginBottom: 12 },
  sectionSubtitle: { fontSize: 13, color: colors.gray500, marginBottom: 12, marginTop: -6 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, paddingHorizontal: 16,
    backgroundColor: colors.white, borderRadius: borderRadius.lg,
    marginBottom: 8, borderWidth: 1, borderColor: colors.gray200,
  },
  rowLabel: { fontSize: 14, color: colors.gray500 },
  rowValue: { fontSize: 14, fontWeight: '500', color: colors.gray700 },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderBottomWidth: 0,
  },
  prefRowLast: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  prefRowFirst: {
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  prefTextCol: {
    flex: 1,
    marginRight: 12,
  },
  prefLabel: { fontSize: 14, fontWeight: '500', color: colors.gray700 },
  prefDesc: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  actionRow: {
    paddingVertical: 16, paddingHorizontal: 16,
    backgroundColor: colors.white, borderRadius: borderRadius.lg,
    marginBottom: 8, borderWidth: 1, borderColor: colors.gray200,
  },
  actionText: { fontSize: 16, color: colors.gray700 },
  langRow: { flexDirection: 'row', gap: 8 },
  langBtn: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    backgroundColor: colors.white, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.gray200,
  },
  langBtnActive: { backgroundColor: colors.black, borderColor: colors.black },
  langBtnText: { fontSize: 16, fontWeight: '500', color: colors.gray600 },
  langBtnTextActive: { color: colors.white },
  signOutButton: { marginTop: 16, width: '100%' },
});
