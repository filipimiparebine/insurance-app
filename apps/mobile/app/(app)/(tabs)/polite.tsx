import { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { client } from '../../../src/lib/orpc-client';
import { Button } from '../../../src/components';
import { colors, borderRadius } from '../../../src/theme/tokens';
import FadeInView from '../../../src/components/FadeInView';
import AnimatedPressable from '../../../src/components/AnimatedPressable';
import { useLocale } from '../../../src/lib/LocaleProvider';

interface PolicyDisplay {
  id: string;
  plateNumber: string;
  insurer: string;
  premium: string;
  status: string;
  startDate: string;
  endDate: string;
  policyNumber: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' });
}

function mapPolicy(p: any): PolicyDisplay {
  return {
    id: p.id,
    plateNumber: p.vehiclePlateNumber ?? '-',
    insurer: p.insurerName ?? p.insurerCode ?? '-',
    premium: p.premiumAmount
      ? new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 2 }).format(parseFloat(p.premiumAmount))
      : '-',
    status: p.status ?? 'unknown',
    startDate: formatDate(p.startDate),
    endDate: formatDate(p.endDate),
    policyNumber: p.policyNumber ?? p.id?.slice(0, 8) ?? '-',
  };
}

export default function PoliteTab() {
  const { t } = useLocale();
  const { userId } = useAuth();
  const [policies, setPolicies] = useState<PolicyDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicies();
  }, [userId]);

  const fetchPolicies = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await (client as any).public.policies.list({ userId, limit: 50, offset: 0 });
      setPolicies((result ?? []).map(mapPolicy));
    } catch (err: any) {
      setError(err?.message ?? 'Nu s-au putut încărca polițele.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF6B1A" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>Se încarcă polițele...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ fontSize: 16, color: '#dc2626', marginBottom: 8 }}>Eroare</Text>
        <Text style={{ color: '#6b7280', marginBottom: 16 }}>{error}</Text>
        <Button onPress={fetchPolicies}>Încearcă din nou</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {policies.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>{t('dashboard.no_policies_title')}</Text>
          <Text style={styles.emptyDesc}>{t('dashboard.no_policies_desc')}</Text>
          <Button onPress={() => router.push('/quote/step-1')}>{t('dashboard.calculate_price_btn')}</Button>
        </View>
      ) : (
        <FlatList
          data={policies}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <FadeInView delay={index * 100}>
              <AnimatedPressable>
                <TouchableOpacity style={styles.card} onPress={() => router.push(`/politica/${item.id}` as any)}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.plateNumber}>{item.plateNumber}</Text>
                    <View style={[styles.badge, { backgroundColor: item.status === 'active' ? '#16a34a' : '#9ca3af' }]}>
                      <Text style={styles.badgeText}>{item.status === 'active' ? t('dashboard.policy_active') : t('dashboard.policy_expired')}</Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <Row label={t('dashboard.policy_insurer')} value={item.insurer} />
                    <Row label={t('dashboard.policy_premium')} value={item.premium} />
                    <Row label={t('dashboard.policy_validity')} value={`${item.startDate} — ${item.endDate}`} />
                    <Row label={t('dashboard.policy_number')} value={item.policyNumber} />
                  </View>
                </TouchableOpacity>
              </AnimatedPressable>
            </FadeInView>
          )}
        />
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { justifyContent: 'center', alignItems: 'center', padding: 32 },
  list: { padding: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  emptyDesc: { fontSize: 14, color: '#6b7280', marginTop: 8, marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  plateNumber: { fontSize: 20, fontWeight: '600', color: '#111827' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  cardBody: { backgroundColor: '#f9fafb', borderRadius: 10, padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { fontSize: 14, color: '#6b7280' },
  value: { fontSize: 14, fontWeight: '500', color: '#111827' },
});
