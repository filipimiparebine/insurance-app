import { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { client } from '../../src/lib/orpc-client';
import { getQuoteFormData, resetQuoteFormData, goNext } from '../../src/lib/quote-state';
import { toCreateQuoteInput, mapOffersFromApi } from '../../src/lib/mappers';
import { formatPrice } from '@blaj/shared/i18n';
import { useLocale } from '../../src/lib/LocaleProvider';

interface DisplayOffer {
  id: string;
  quoteSearchId: string;
  insurerCode: string;
  insurerName: string;
  durationMonths: number;
  premiumNet: number;
  brokerCommission: number;
  totalAmount: number;
  currency: string;
  bonusMalusClass: string;
  isAvailable: boolean;
  unavailableReason: string | null;
}

function formatPremium(amount: number, locale: 'ro' | 'en'): string {
  if (amount <= 0) return 'N/A';
  return formatPrice(amount, locale);
}

export default function QuoteStep4() {
  const { getToken, userId } = useAuth();
  const { t, locale } = useLocale();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [offers, setOffers] = useState<DisplayOffer[]>([]);
  const [searchId, setSearchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userId) {
        setError(t('errors.server.generic'));
        setLoading(false);
        return;
      }

      const form = getQuoteFormData();
      const input = toCreateQuoteInput(form, userId);

      const result = await (client as any).public.quotes.create(input);

      setSearchId(result.searchId);
      setOffers(mapOffersFromApi(result.offers));
    } catch (err: any) {
      setError(err?.message ?? t('errors.server.generic'));
    } finally {
      setLoading(false);
    }
  };

  const primaryDuration = 12;
  const primaryOffers = offers.filter((o) => o.durationMonths === primaryDuration && o.isAvailable);
  const secondaryDuration = offers.length > 0 ? offers.find((o) => o.durationMonths !== primaryDuration)?.durationMonths ?? 6 : 6;
  const secondaryOffers = offers.filter((o) => o.durationMonths === secondaryDuration && o.isAvailable);

  const unavailable = offers.filter((o) => !o.isAvailable);
  const uniqueUnavailable = unavailable.filter((o, i, arr) => arr.findIndex((x) => x.insurerCode === o.insurerCode) === i);
  const bestOffer = primaryOffers.sort((a, b) => a.totalAmount - b.totalAmount)[0];

  const getSecondaryForInsurer = (insurerCode: string) =>
    secondaryOffers.find((o) => o.insurerCode === insurerCode);

  const handleBuy = async (offer: DisplayOffer) => {
    setSelectedId(offer.id);
    const secondary = getSecondaryForInsurer(offer.insurerCode);
    goNext();

    router.push({
      pathname: '/quote/payment' as any,
      params: {
        searchId: searchId ?? '',
        offerId: offer.id,
        insurerCode: offer.insurerCode,
        amount: offer.totalAmount.toString(),
        currency: offer.currency,
        durationMonths: offer.durationMonths.toString(),
        secondaryAmount: secondary?.totalAmount.toString() ?? '',
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B1A" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Eroare</Text>
        <Text style={styles.errorDesc}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOffers}>
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('offers.title')}</Text>
        <Text style={styles.subtitle}>{t('wizard.offers_subtitle', { n: primaryOffers.length })}</Text>

        {bestOffer && (
          <View style={styles.bestOfferBanner}>
            <Text style={styles.bestOfferLabel}>{t('offers.best_value')}</Text>
            <Text style={styles.bestOfferName}>
              {bestOffer.insurerCode} — {formatPremium(bestOffer.totalAmount, locale)} / {t('offers.months', { n: primaryDuration })}
            </Text>
            <Text style={styles.bestOfferMonthly}>
              ≈ {formatPremium(bestOffer.totalAmount / primaryDuration, locale)} {t('offers.per_month')}
            </Text>
          </View>
        )}

        {primaryOffers.map((offer) => {
          const secondary = getSecondaryForInsurer(offer.insurerCode);
          return (
            <View key={offer.id} style={[styles.offerCard, selectedId === offer.id && styles.offerCardSelected]}>
              <View style={styles.offerHeader}>
                <Text style={styles.offerName}>{offer.insurerCode}</Text>
                <Text style={styles.offerBM}>B{offer.bonusMalusClass}</Text>
              </View>

              <View style={styles.offerPrices}>
                <View style={styles.priceCol}>
                  <Text style={styles.priceLabel}>{t('offers.months', { n: primaryDuration })}</Text>
                  <Text style={styles.priceValue}>{formatPremium(offer.totalAmount, locale)}</Text>
                  {offer.totalAmount > 0 && (
                    <Text style={styles.priceMonthly}>{formatPremium(offer.totalAmount / primaryDuration, locale)} {t('offers.per_month')}</Text>
                  )}
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceCol}>
                  <Text style={styles.priceLabel}>{t('offers.months', { n: secondaryDuration })}</Text>
                  <Text style={styles.priceValue}>{secondary ? formatPremium(secondary.totalAmount, locale) : 'N/A'}</Text>
                  {secondary && secondary.totalAmount > 0 && (
                    <Text style={styles.priceMonthly}>{formatPremium(secondary.totalAmount / secondaryDuration, locale)} {t('offers.per_month')}</Text>
                  )}
                </View>
              </View>

              <View style={styles.priceBreakdown}>
                <Text style={styles.breakdownText}>
                  {t('offers.net_premium_label')} {formatPremium(offer.premiumNet, locale)} + {t('offers.commission_label')} {formatPremium(offer.brokerCommission, locale)}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.buyButton, selectedId === offer.id && styles.buyButtonLoading]}
                onPress={() => handleBuy(offer)}
                disabled={selectedId !== null}
              >
                {selectedId === offer.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buyButtonText}>{t('offers.choose')} {primaryDuration}L</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        {uniqueUnavailable.length > 0 && (
          <View style={styles.unavailableSection}>
            <Text style={styles.unavailableTitle}>{t('offers.unavailable')} ({uniqueUnavailable.length})</Text>
            {uniqueUnavailable.map((offer) => (
              <View key={offer.id} style={styles.unavailableRow}>
                <Text style={styles.unavailableName}>{offer.insurerCode}</Text>
                <Text style={styles.unavailableReason}>{offer.unavailableReason ?? t('offers.unavailable')}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#f9fafb' },
  loadingText: { fontSize: 16, color: '#6b7280', marginTop: 16 },
  errorIcon: { fontSize: 48, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 8 },
  errorDesc: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  retryButton: { height: 48, backgroundColor: '#FF6B1A', borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '600', color: '#0A0A0F', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 16 },
  bestOfferBanner: { backgroundColor: '#0A0A0F', borderRadius: 16, padding: 20, marginBottom: 16 },
  bestOfferLabel: { fontSize: 12, fontWeight: '500', color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  bestOfferName: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 4 },
  bestOfferMonthly: { fontSize: 14, color: '#9ca3af' },
  offerCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  offerCardSelected: { borderColor: '#FF6B1A', borderWidth: 2 },
  offerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  offerName: { fontSize: 17, fontWeight: '600', color: '#111827', flex: 1 },
  offerBM: { fontSize: 13, fontWeight: '500', color: '#6b7280', backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  offerPrices: { flexDirection: 'row', backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, marginBottom: 8 },
  priceCol: { flex: 1, alignItems: 'center' },
  priceLabel: { fontSize: 12, fontWeight: '500', color: '#6b7280', marginBottom: 4 },
  priceValue: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  priceMonthly: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  priceDivider: { width: 1, backgroundColor: '#e5e7eb', marginHorizontal: 12 },
  priceBreakdown: { marginBottom: 8 },
  breakdownText: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
  buyButton: { height: 48, backgroundColor: '#FF6B1A', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buyButtonLoading: { backgroundColor: '#ff9a5a' },
  buyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  unavailableSection: { marginTop: 8 },
  unavailableTitle: { fontSize: 16, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
  unavailableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#fff', borderRadius: 10, marginBottom: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  unavailableName: { fontSize: 14, color: '#374151' },
  unavailableReason: { fontSize: 14, color: '#dc2626', flex: 1, textAlign: 'right' },
});
