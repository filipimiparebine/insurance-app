import { useCallback, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { colors, spacing, borderRadius, typography, shadows } from '../../../src/theme/tokens';
import { Button } from '../../../src/components/Button';
import { useLocale } from '../../../src/lib/LocaleProvider';

interface PolicyDetail {
  id: string;
  policyNumber: string;
  policyType: string;
  insurer: string;
  plateNumber: string;
  premium: string;
  currency: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'pending_cancellation';
  startDate: string;
  endDate: string;
  durationMonths: number;
  pdfUrl: string | null;
  ipidUrl: string | null;
  withdrawalUntil: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;

  vehicle?: {
    make: string;
    model: string;
    vin: string;
    year: number;
    engineCapacity: string;
    fuelType: string;
  };

  rcaDetails?: {
    bonusMalusClass: string;
    directSettlement: boolean;
    baarCode: string;
    excludedCountries: string[];
  };

  owner?: {
    name: string;
    type: 'individual' | 'company';
    cnp?: string;
    cui?: string;
  };
}

const DEMO_POLICY: PolicyDetail = {
  id: '1',
  plateNumber: 'BV18BFG',
  insurer: 'eazy.insure',
  premium: '1.383,79',
  currency: 'RON',
  status: 'active',
  startDate: '28 apr 2026',
  endDate: '28 apr 2027',
  durationMonths: 12,
  policyNumber: 'RCA-2026-001234',
  policyType: 'rca',
  pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  ipidUrl: null,
  withdrawalUntil: '28 mai 2026',
  cancelledAt: null,
  cancellationReason: null,
  vehicle: {
    make: 'Volkswagen',
    model: 'Golf VII',
    vin: 'WVWZZZAUZJW123456',
    year: 2018,
    engineCapacity: '1.6 TDI',
    fuelType: 'Diesel',
  },
  rcaDetails: {
    bonusMalusClass: 'B3',
    directSettlement: true,
    baarCode: 'BARCA167890',
    excludedCountries: [],
  },
  owner: {
    name: 'Filip Blajiu',
    type: 'individual',
    cnp: '***',
  },
};

function StatusBadge({ status, t }: { status: PolicyDetail['status']; t: (path: string, params?: Record<string, string | number>) => string }) {
  const labels: Record<string, string> = {
    active: t('policy_detail.status_active'),
    expired: t('policy_detail.status_expired'),
    cancelled: t('policy_detail.status_cancelled'),
    pending: t('policy_detail.status_pending'),
    pending_cancellation: t('policy_detail.status_pending_cancellation'),
  };
  const config: Record<string, { bg: string; text: string }> = {
    active: { bg: '#dcfce7', text: '#166534' },
    expired: { bg: '#f3f4f6', text: '#6b7280' },
    cancelled: { bg: '#fee2e2', text: '#991b1b' },
    pending: { bg: '#fef3c7', text: '#92400e' },
    pending_cancellation: { bg: '#fef3c7', text: '#92400e' },
  };
  const c = config[status] ?? config.pending;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{labels[status] ?? labels.pending}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

function SkeletonBlock() {
  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <View key={i} style={[styles.skeletonLine, { width: `${[60, 80, 45, 70, 55, 85, 50, 65][i - 1]}%` }]} />
      ))}
    </View>
  );
}

export default function PoliticaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocale();

  const policy: PolicyDetail = DEMO_POLICY;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleViewPdf = useCallback(async () => {
    if (!policy.pdfUrl) {
      Alert.alert(t('policy_detail.pdf_unavailable_title'), t('policy_detail.pdf_unavailable'));
      return;
    }
    try {
      await WebBrowser.openBrowserAsync(policy.pdfUrl, {
        dismissButtonStyle: 'close',
        toolbarColor: colors.black,
      });
    } catch {
      Alert.alert(t('common.error'), t('policy_detail.view_pdf_error'));
    }
  }, [policy.pdfUrl, t]);

  const handleCancelPolicy = useCallback(() => {
    Alert.alert(
      t('policy_detail.cancel_confirm_title'),
      t('policy_detail.cancel_confirm_text'),
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('policy_detail.cancel_confirm_yes'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('policy_detail.cancel_reason_title'),
              t('common.search') + ':',
              [
                { text: t('policy_detail.cancel_reason_sold'), onPress: () => confirmCancel(t('policy_detail.cancel_reason_sold')) },
                { text: t('policy_detail.cancel_reason_better_offer'), onPress: () => confirmCancel(t('policy_detail.cancel_reason_better_offer')) },
                { text: t('policy_detail.cancel_reason_no_need'), onPress: () => confirmCancel(t('policy_detail.cancel_reason_no_need')) },
                { text: t('policy_detail.back'), style: 'cancel' },
              ],
            );
          },
        },
      ],
    );
  }, [t]);

  const confirmCancel = async (reason: string) => {
    Alert.alert(t('policy_detail.cancel_policy'), t('common.loading'));
  };

  const handleContact = useCallback(() => {
    Alert.alert(t('policy_detail.contact_us'), 'Email: support@blaj.io\nTelefon: 0800 123 456');
  }, [t]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>{t('policy_detail.error_title')}</Text>
        <Text style={styles.errorDesc}>{error}</Text>
        <Button variant="outline" onPress={() => setError(null)}>
          {t('common.retry')}
        </Button>
      </View>
    );
  }

  if (!policy) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>📄</Text>
        <Text style={styles.errorTitle}>{t('policy_detail.not_found_title')}</Text>
        <Text style={styles.errorDesc}>{t('policy_detail.not_found_desc')}</Text>
        <Button variant="outline" onPress={() => router.back()}>
          {t('policy_detail.back')}
        </Button>
      </View>
    );
  }

  const isActive = policy.status === 'active';
  const canCancel = isActive || policy.status === 'pending';

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('policy_detail.title'),
          headerLargeTitle: true,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.orange}
            colors={[colors.orange]}
          />
        }
      >
        {loading ? (
          <SkeletonBlock />
        ) : (
          <>
            <View style={styles.headerCard}>
              <View style={styles.headerTop}>
                <Text style={styles.plateNumber}>{policy.plateNumber}</Text>
                <StatusBadge status={policy.status} t={t} />
              </View>
              <Text style={styles.insurerName}>{policy.insurer}</Text>
              <Separator />
              <InfoRow label={t('policy_detail.validity')} value={`${policy.startDate} — ${policy.endDate}`} />
              <InfoRow label={t('policy_detail.premium')} value={`${policy.premium} ${policy.currency}`} />
              <InfoRow label={t('policy_detail.policy_number')} value={policy.policyNumber} />
              <InfoRow label={t('policy_detail.type')} value={policy.policyType.toUpperCase()} />
              <InfoRow label={t('policy_detail.duration')} value={t('offers.months', { n: policy.durationMonths })} />
              {policy.withdrawalUntil && (
                <InfoRow label={t('policy_detail.withdrawal_until')} value={policy.withdrawalUntil} />
              )}
              {policy.cancelledAt && (
                <InfoRow label={t('policy_detail.cancelled_at')} value={policy.cancelledAt} />
              )}
            </View>

            {policy.vehicle && (
              <SectionCard title={t('policy_detail.vehicle_section')}>
                <InfoRow label={t('vehicle.marca')} value={policy.vehicle.make} />
                <InfoRow label={t('vehicle.model')} value={policy.vehicle.model} />
                <InfoRow label="VIN" value={policy.vehicle.vin} />
                <InfoRow label={t('vehicle.an_fabricatie')} value={String(policy.vehicle.year)} />
                <InfoRow label={t('vehicle.capacitate_cilindrica')} value={policy.vehicle.engineCapacity} />
                <InfoRow label={t('vehicle.tip_combustibil')} value={policy.vehicle.fuelType} />
              </SectionCard>
            )}

            {policy.rcaDetails && (
              <SectionCard title={t('policy_detail.rca_details_section')}>
                <InfoRow label={t('policy_detail.bonus_malus_class')} value={policy.rcaDetails.bonusMalusClass} />
                <InfoRow
                  label={t('policy_detail.direct_settlement')}
                  value={policy.rcaDetails.directSettlement ? t('common.yes') : t('common.no')}
                />
                <InfoRow label={t('policy_detail.baar_code')} value={policy.rcaDetails.baarCode} />
                {policy.rcaDetails.excludedCountries.length > 0 && (
                  <InfoRow
                    label={t('policy_detail.excluded_countries')}
                    value={policy.rcaDetails.excludedCountries.join(', ')}
                  />
                )}
              </SectionCard>
            )}

            {policy.owner && (
              <SectionCard title={t('policy_detail.owner_section')}>
                <InfoRow label={t('policy_detail.owner_name')} value={policy.owner.name} />
                <InfoRow
                  label={t('policy_detail.owner_type')}
                  value={policy.owner.type === 'individual' ? t('policy_detail.owner_type_individual') : t('policy_detail.owner_type_company')}
                />
                {policy.owner.cnp && <InfoRow label={t('owner.cnp')} value={policy.owner.cnp} />}
                {policy.owner.cui && <InfoRow label={t('owner.cui')} value={policy.owner.cui} />}
              </SectionCard>
            )}

            <View style={styles.actions}>
              {policy.pdfUrl && (
                <Button onPress={handleViewPdf} style={styles.actionButton}>
                  {t('policy_detail.view_pdf')}
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="outline"
                  onPress={handleCancelPolicy}
                  style={styles.actionButton}
                >
                  {t('policy_detail.cancel_policy')}
                </Button>
              )}
              <Button
                variant="ghost"
                onPress={handleContact}
                style={styles.actionButton}
              >
                {t('policy_detail.contact_us')}
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  errorDesc: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  headerCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  plateNumber: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.gray700,
    letterSpacing: 1,
  },
  insurerName: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray500,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
    flex: 1.5,
    textAlign: 'right',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray600,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    width: '100%',
  },
  skeletonContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
    opacity: 0.7,
  },
});
