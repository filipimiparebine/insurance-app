import { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useStripe } from '@stripe/stripe-react-native';
import { client } from '../../src/lib/orpc-client';
import { resetQuoteFormData, goToStep } from '../../src/lib/quote-state';
import { formatPrice } from '@blaj/shared/i18n';
import { useLocale } from '../../src/lib/LocaleProvider';

export default function PaymentScreen() {
  const params = useLocalSearchParams<{
    searchId: string;
    offerId: string;
    insurerCode: string;
    amount: string;
    currency: string;
    durationMonths: string;
    secondaryAmount: string;
  }>();
  const { userId } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { t, locale } = useLocale();

  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'confirming' | 'success' | 'error'>('idle');

  useEffect(() => {
    goToStep('checkout');
  }, []);

  useEffect(() => {
    if (status === 'success') {
      goToStep('thank_you');
    }
  }, [status]);

  const amount = params.amount ? parseFloat(params.amount) : 0;
  const displayAmount = formatPrice(amount, locale);

  const handlePay = async () => {
    if (!userId || !params.searchId || !params.offerId) {
      Alert.alert('Eroare', t('errors.server.generic'));
      return;
    }

    setProcessing(true);
    setStatus('confirming');

    try {
      const result = await (client as any).public.payments.createIntent({
        userId,
        quoteOfferId: params.offerId,
        amount: Math.round(amount * 100),
        currency: params.currency ?? 'RON',
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: result.clientSecret,
        merchantDisplayName: 'blaj.io',
        returnURL: 'blaj://payment-complete',
      });

      if (initError) {
        setStatus('error');
        setProcessing(false);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === 'Canceled') {
          setStatus('idle');
        } else {
          setStatus('error');
        }
        setProcessing(false);
        return;
      }

      setStatus('success');
      resetQuoteFormData();
    } catch (err: any) {
      setStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  if (status === 'success') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>{t('success.title')}</Text>
        <Text style={styles.successDesc}>{t('success.subtitle')}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(app)')}>
          <Text style={styles.primaryButtonText}>{t('common.go_dashboard')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/(app)/polite')}>
          <Text style={styles.secondaryButtonText}>{t('common.see_policies')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.successTitle}>{t('success.payment_failed')}</Text>
        <Text style={styles.successDesc}>{t('success.payment_failed_desc')}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setStatus('idle')}>
          <Text style={styles.primaryButtonText}>{t('success.retry_payment')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{t('checkout.order_summary')}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('checkout.insurer')}</Text>
          <Text style={styles.summaryValue}>{params.insurerCode || '-'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('checkout.duration')}</Text>
          <Text style={styles.summaryValue}>{t('offers.months', { n: params.durationMonths || '12' })}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryRowTotal]}>
          <Text style={styles.summaryLabelTotal}>{t('checkout.total')}</Text>
          <Text style={styles.summaryValueTotal}>{displayAmount}</Text>
        </View>
      </View>

      <View style={styles.paymentMethods}>
        <Text style={styles.paymentMethodsTitle}>{t('checkout.payment_method')}</Text>
        <View style={styles.paymentMethodCard}>
          <Text style={styles.paymentMethodIcon}>💳</Text>
          <View>
            <Text style={styles.paymentMethodName}>{t('checkout.card_payment')}</Text>
            <Text style={styles.paymentMethodDesc}>{t('checkout.card_payment_desc')}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.payButton, processing && styles.payButtonDisabled]}
        onPress={handlePay}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>{t('checkout.pay_amount', { amount: displayAmount })}</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.securityNote}>{t('checkout.security_note')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#f9fafb' },
  successIcon: { fontSize: 64, marginBottom: 16 },
  errorIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '600', color: '#111827', marginBottom: 8 },
  successDesc: { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  primaryButton: { height: 50, backgroundColor: '#FF6B1A', borderRadius: 12, alignItems: 'center', justifyContent: 'center', width: '100%' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { marginTop: 12, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', width: '100%' },
  secondaryButtonText: { color: '#FF6B1A', fontSize: 16, fontWeight: '500' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  summaryTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryRowTotal: { borderTopWidth: 1, borderTopColor: '#e5e7eb', marginTop: 8, paddingTop: 12 },
  summaryLabel: { fontSize: 15, color: '#6b7280' },
  summaryValue: { fontSize: 15, color: '#111827' },
  summaryLabelTotal: { fontSize: 17, fontWeight: '600', color: '#111827' },
  summaryValueTotal: { fontSize: 22, fontWeight: 'bold', color: '#FF6B1A' },
  paymentMethods: { marginBottom: 24 },
  paymentMethodsTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  paymentMethodCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  paymentMethodIcon: { fontSize: 28 },
  paymentMethodName: { fontSize: 16, fontWeight: '500', color: '#111827' },
  paymentMethodDesc: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  payButton: { height: 54, backgroundColor: '#FF6B1A', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  payButtonDisabled: { backgroundColor: '#ff9a5a' },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  securityNote: { fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 16, lineHeight: 20 },
});
