import { useState } from 'react';
import { Switch, Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { updateQuoteFormData, getQuoteFormData, useQuoteForm, goNext, STEP_ROUTES } from '../../src/lib/quote-state';
import { validateStep3 } from '../../src/lib/mappers';
import type { DriverData } from '../../src/lib/quote-state';
import FadeInView from '../../src/components/FadeInView';
import AnimatedPressable from '../../src/components/AnimatedPressable';
import { Stepper, HeaderText, Field, FormCard, Button } from '../../src/components';
import { inputStyle, colors, borderRadius } from '../../src/theme/tokens';
import { useLocale } from '../../src/lib/LocaleProvider';

export default function QuoteStep3() {
  const [form, setForm] = useState(getQuoteFormData());
  const { t } = useLocale();
  const { stepperCurrent } = useQuoteForm();

  const update = (updates: Partial<typeof form>) => {
    const next = { ...form, ...updates };
    setForm(next);
    updateQuoteFormData(next);
  };

  const handleNext = () => {
    const validation = validateStep3(form);
    if (!validation.valid) {
      Alert.alert('Date incomplete', validation.errors.join('\n'));
      return;
    }
    const next = goNext();
    if (next && STEP_ROUTES[next]) {
      router.push(STEP_ROUTES[next] as any);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FadeInView>
        <Stepper total={4} current={stepperCurrent} />
      </FadeInView>

      <FadeInView delay={80}>
        <HeaderText title={t('config.title')} subtitle={t('wizard.config_subtitle')} />
      </FadeInView>

      <Field label={`${t('config.data_inceput')} *`}>
        <TextInput
          style={inputStyle}
          value={form.startDate}
          onChangeText={(t) => update({ startDate: t })}
          placeholder="ZZ/LL/AAAA"
          placeholderTextColor="#9ca3af"
        />
        <Text style={styles.helper}>{t('config.data_inceput_help')}</Text>
      </Field>

      <FormCard title={t('config.durata_label')}>
        <View style={styles.durationRow}>
          <View style={styles.durationCard}>
            <Text style={styles.durationLabel}>{t('config.durata_12_luni')}</Text>
            <Text style={styles.durationBadge}>{t('config.recommended')}</Text>
          </View>
          <View style={[styles.durationCard, styles.durationCardSecondary]}>
            <Text style={styles.durationLabelSecondary}>{t('offers.months', { n: form.durationMonthsSecondary })}</Text>
            <View style={styles.durationStepper}>
              {[1, 3, 6, 9, 11].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.durationOption, parseInt(form.durationMonthsSecondary) === m && styles.durationOptionActive]}
                  onPress={() => update({ durationMonthsSecondary: m.toString() })}
                >
                  <Text style={[styles.durationOptionText, parseInt(form.durationMonthsSecondary) === m && styles.durationOptionTextActive]}>{m}L</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </FormCard>

      <Field label={t('config.decontare_directa')}>
        <View style={styles.switchRow}>
          <Text style={styles.switchDesc}>{t('config.decontare_directa_help')}</Text>
          <Switch
            value={form.directSettlementRequested}
            onValueChange={(v) => update({ directSettlementRequested: v })}
            trackColor={{ false: colors.gray200, true: colors.orange }}
            thumbColor={colors.white}
          />
        </View>
      </Field>

      <View style={styles.leasingSection}>
        <View style={styles.switchRow}>
          <Text style={styles.leasingLabel}>{t('owner.leasing')}</Text>
          <Switch
            value={form.isLeasing}
            onValueChange={(v) => update({ isLeasing: v, ...(v ? {} : { leasingCompany: '' }) })}
            trackColor={{ false: colors.gray200, true: colors.orange }}
            thumbColor={colors.white}
          />
        </View>
        {form.isLeasing && (
          <Field label={t('owner.companie_leasing')} required>
            <TextInput
              style={inputStyle}
              value={form.leasingCompany}
              onChangeText={(t) => update({ leasingCompany: t })}
              placeholder="Porsche Leasing"
              placeholderTextColor="#9ca3af"
            />
          </Field>
        )}
      </View>

      {/* Drivers */}
      <FormCard title={t('config.soferi_adiționali')}>
        <View style={styles.switchRow}>
          <Text style={styles.driverSwitchLabel}>{t('config.sofer_diferit')}</Text>
          <Switch
            value={!form.driverIsOwner}
            onValueChange={(v) => {
              update({ driverIsOwner: !v, ...(v ? {} : { drivers: [] }) });
            }}
            trackColor={{ false: colors.gray200, true: colors.orange }}
            thumbColor={colors.white}
          />
        </View>

        {form.driverIsOwner ? (
          <Field label={t('config.an_obtinere_permis')}>
            <TextInput
              style={inputStyle}
              value={form.licenseYear}
              onChangeText={(text) => update({ licenseYear: text.replace(/[^0-9]/g, '') })}
              placeholder="1990"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              maxLength={4}
            />
          </Field>
        ) : (
          form.drivers.map((d, i) => (
            <View key={i} style={styles.driverCard}>
              <View style={styles.driverCardHeader}>
                <Text style={styles.driverCardTitle}>{t('config.sofer')} {i + 1}</Text>
                <TouchableOpacity onPress={() => {
                  const next = form.drivers.filter((_, j) => j !== i);
                  update({ drivers: next });
                }}>
                  <Text style={styles.removeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <Field label={t('owner.nume')} required containerStyle={{ flex: 1 }}>
                  <TextInput style={inputStyle} value={d.lastName} onChangeText={(text) => {
                    const next = [...form.drivers];
                    next[i] = { ...next[i], lastName: text };
                    update({ drivers: next });
                  }} placeholder="Popescu" placeholderTextColor="#9ca3af" />
                </Field>
                <Field label={t('owner.prenume')} required containerStyle={{ flex: 1 }}>
                  <TextInput style={inputStyle} value={d.firstName} onChangeText={(text) => {
                    const next = [...form.drivers];
                    next[i] = { ...next[i], firstName: text };
                    update({ drivers: next });
                  }} placeholder="Ion" placeholderTextColor="#9ca3af" />
                </Field>
              </View>
              <Field label={t('owner.cnp')} required>
                <TextInput
                  style={inputStyle}
                  value={d.cnp}
                  onChangeText={(text) => {
                    const next = [...form.drivers];
                    next[i] = { ...next[i], cnp: text.replace(/[^0-9]/g, '') };
                    update({ drivers: next });
                  }}
                  placeholder="13 cifre"
                  placeholderTextColor="#9ca3af"
                  maxLength={13}
                  keyboardType="number-pad"
                />
              </Field>
              <Field label={t('config.an_obtinere_permis')}>
                <TextInput
                  style={inputStyle}
                  value={d.licenseYear}
                  onChangeText={(text) => {
                    const next = [...form.drivers];
                    next[i] = { ...next[i], licenseYear: text.replace(/[^0-9]/g, '') };
                    update({ drivers: next });
                  }}
                  placeholder="1990"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </Field>
            </View>
          ))
        )}

        {!form.driverIsOwner && form.drivers.length < 5 && (
          <TouchableOpacity
            style={styles.addDriverBtn}
            onPress={() => {
              update({ drivers: [...form.drivers, { firstName: '', lastName: '', cnp: '', licenseYear: '' }] });
            }}
          >
            <Text style={styles.addDriverBtnText}>+ {t('config.adauga_sofer')}</Text>
          </TouchableOpacity>
        )}
      </FormCard>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>{t('checkout.summary')}</Text>
        <SummaryRow label={t('checkout.vehicle')} value={`${form.make} ${form.model} (${form.plateNumber || form.vin})`} />
        <SummaryRow label={t('checkout.insured')} value={`${form.firstName} ${form.lastName}`} />
      </View>

      <AnimatedPressable>
        <Button onPress={handleNext} style={styles.nextButton}>{t('config.vezi_oferte')} →</Button>
      </AnimatedPressable>
    </ScrollView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryRowLabel}>{label}</Text>
      <Text style={styles.summaryRowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  helper: { fontSize: 12, color: colors.gray500, marginTop: 4 },
  durationRow: { flexDirection: 'row', gap: 12 },
  durationCard: {
    flex: 1, backgroundColor: colors.black, borderRadius: borderRadius.lg, padding: 16, alignItems: 'center',
  },
  durationCardSecondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray200 },
  durationLabel: { fontSize: 18, fontWeight: '600', color: colors.white, marginBottom: 4 },
  durationLabelSecondary: { fontSize: 18, fontWeight: '600', color: colors.black, marginBottom: 8 },
  durationBadge: { fontSize: 11, fontWeight: '500', color: colors.green, backgroundColor: 'rgba(22,163,74,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  durationStepper: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  durationOption: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.sm, backgroundColor: colors.gray100 },
  durationOptionActive: { backgroundColor: colors.orange },
  durationOptionText: { fontSize: 13, fontWeight: '500', color: colors.gray600 },
  durationOptionTextActive: { color: colors.white },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  switchDesc: { fontSize: 14, color: colors.gray500, flex: 1 },
  leasingSection: {
    backgroundColor: colors.gray50, borderRadius: borderRadius.xl, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: colors.gray200,
  },
  leasingLabel: { fontSize: 15, fontWeight: '600', color: colors.gray700, flex: 1 },
  summaryCard: {
    backgroundColor: colors.gray50, borderRadius: borderRadius.xl, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: colors.gray200,
  },
  summaryCardTitle: { fontSize: 16, fontWeight: '600', color: colors.gray700, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryRowLabel: { fontSize: 14, color: colors.gray500 },
  summaryRowValue: { fontSize: 14, fontWeight: '500', color: colors.gray700 },
  nextButton: { marginTop: 8, height: 52 },
  driverSwitchLabel: { fontSize: 15, fontWeight: '600', color: colors.gray700, flex: 1 },
  driverCard: {
    backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: 16, marginTop: 12,
    borderWidth: 1, borderColor: colors.gray200,
  },
  driverCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  driverCardTitle: { fontSize: 14, fontWeight: '600', color: colors.gray700 },
  removeBtn: { fontSize: 16, color: colors.gray400, padding: 4 },
  addDriverBtn: {
    marginTop: 12, paddingVertical: 12, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.gray200, borderStyle: 'dashed',
    alignItems: 'center',
  },
  addDriverBtnText: { fontSize: 14, color: colors.orange, fontWeight: '500' },
  row: { flexDirection: 'row', gap: 12 },
});
