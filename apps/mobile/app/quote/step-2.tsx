import { useState } from 'react';
import { Text, TextInput, View, ScrollView, StyleSheet, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { updateQuoteFormData, getQuoteFormData, useQuoteForm, goNext, STEP_ROUTES } from '../../src/lib/quote-state';
import { validateStep2 } from '../../src/lib/mappers';
import { Stepper, HeaderText, Field, FormCard, Button } from '../../src/components';
import FadeInView from '../../src/components/FadeInView';
import AnimatedPressable from '../../src/components/AnimatedPressable';
import { inputStyle, colors } from '../../src/theme/tokens';
import { useLocale } from '../../src/lib/LocaleProvider';

export default function QuoteStep2() {
  const [form, setForm] = useState(getQuoteFormData());
  const { t } = useLocale();
  const { stepperCurrent } = useQuoteForm();

  const update = (updates: Partial<typeof form>) => {
    const next = { ...form, ...updates };
    setForm(next);
    updateQuoteFormData(next);
  };

  const handleNext = () => {
    const validation = validateStep2(form);
    if (!validation.valid) {
      Alert.alert('Date incomplete', validation.errors.join('\n'));
      return;
    }
    const next = goNext();
    if (next && STEP_ROUTES[next]) {
      router.push(STEP_ROUTES[next] as any);
    }
  };

  const isCompany = form.personType === 'company';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FadeInView>
        <Stepper total={4} current={stepperCurrent} />
      </FadeInView>

      <FadeInView delay={80}>
        <HeaderText title={t('owner.title')} subtitle={t('common.encrypted_note')} />
      </FadeInView>

      <Field label={t('owner.tip_persoana')} required>
        <View style={styles.personTypeToggle}>
          {(['individual', 'company'] as const).map((opt) => (
            <Button
              key={opt}
              variant={form.personType === opt ? 'secondary' : 'ghost'}
              onPress={() => update({ personType: opt })}
              style={styles.personTypeBtn}
            >
              {opt === 'individual' ? t('owner.pf') : t('owner.pj')}
            </Button>
          ))}
        </View>
      </Field>

      {!isCompany && (
        <>
          <FormCard title={t('owner.title')}>
            <View style={styles.row}>
              <Field label={t('owner.nume')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.lastName} onChangeText={(txt) => update({ lastName: txt })} placeholder="Blajiu" placeholderTextColor="#9ca3af" />
              </Field>
              <Field label={t('owner.prenume')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.firstName} onChangeText={(txt) => update({ firstName: txt })} placeholder="Filip" placeholderTextColor="#9ca3af" />
              </Field>
            </View>

            <Field label={t('owner.cnp')} required>
              <TextInput
                style={inputStyle}
                value={form.cnp}
                onChangeText={(txt) => update({ cnp: txt.replace(/[^0-9]/g, '') })}
                placeholder="13 cifre"
                placeholderTextColor="#9ca3af"
                maxLength={13}
                keyboardType="number-pad"
              />
              <Text style={styles.helper}>{t('owner.cnp_helper')}</Text>
            </Field>

            <View style={styles.row}>
              <Field label={t('owner.email')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.email} onChangeText={(txt) => update({ email: txt })} placeholder="email@exemplu.ro" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" />
              </Field>
              <Field label={t('owner.telefon')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.phone} onChangeText={(txt) => update({ phone: txt })} placeholder="+40727..." placeholderTextColor="#9ca3af" keyboardType="phone-pad" />
              </Field>
            </View>

            <Field label={t('owner.adresa')}>
              <TextInput style={inputStyle} value={form.addressCity} onChangeText={(txt) => update({ addressCity: txt })} placeholder={t('owner.localitate')} placeholderTextColor="#9ca3af" />
            </Field>
            <View style={styles.row}>
              <Field label={t('owner.strada')} containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.addressStreet} onChangeText={(txt) => update({ addressStreet: txt })} placeholder={t('owner.strada')} placeholderTextColor="#9ca3af" />
              </Field>
              <Field label={t('owner.numar')} containerStyle={{ width: 80 }}>
                <TextInput style={inputStyle} value={form.addressNumber} onChangeText={(txt) => update({ addressNumber: txt })} placeholder={t('owner.numar')} placeholderTextColor="#9ca3af" />
              </Field>
            </View>

            <Field label={t('owner.judet')}>
              <TextInput style={inputStyle} value={form.addressCounty} onChangeText={(txt) => update({ addressCounty: txt })} placeholder={t('owner.judet')} placeholderTextColor="#9ca3af" />
            </Field>

            <Field label={t('owner.cod_postal')}>
              <TextInput style={inputStyle} value={form.addressPostalCode} onChangeText={(txt) => update({ addressPostalCode: txt })} placeholder="6 cifre" placeholderTextColor="#9ca3af" maxLength={6} keyboardType="number-pad" />
            </Field>

            <Field label={t('owner.leasing')}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>{form.isLeasing ? t('common.yes') : t('common.no')}</Text>
                <Switch
                  value={form.isLeasing}
                  onValueChange={(v) => update({ isLeasing: v })}
                  trackColor={{ false: colors.gray200, true: colors.orange }}
                  thumbColor={colors.white}
                />
              </View>
            </Field>
          </FormCard>
        </>
      )}

      {isCompany && (
        <>
          <FormCard title={`${t('owner.pj')} — ${t('owner.title')}`}>
            <Field label={t('owner.cui')} required>
              <TextInput
                style={inputStyle}
                value={form.companyCui}
                onChangeText={(txt) => update({ companyCui: txt.replace(/[^0-9]/g, '') })}
                placeholder="12345678"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
              />
            </Field>

            <Field label={t('owner.nume_companie')} required>
              <TextInput style={inputStyle} value={form.companyName} onChangeText={(txt) => update({ companyName: txt })} placeholder="SC Exemplu SRL" placeholderTextColor="#9ca3af" />
            </Field>

            <View style={styles.row}>
              <Field label={t('owner.cod_caen')} required containerStyle={{ flex: 1 }}>
                <TextInput
                  style={inputStyle}
                  value={form.companyCaen}
                  onChangeText={(txt) => update({ companyCaen: txt.replace(/[^0-9]/g, '') })}
                  placeholder="6201"
                  placeholderTextColor="#9ca3af"
                  maxLength={4}
                  keyboardType="number-pad"
                />
              </Field>
              <Field label={t('owner.tip_societate')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.companyEntityType} onChangeText={(txt) => update({ companyEntityType: txt })} placeholder="SRL" placeholderTextColor="#9ca3af" />
              </Field>
            </View>

            <Field label={t('owner.numar_inregistrare')} required>
              <TextInput
                style={inputStyle}
                value={form.companyRegNumber}
                onChangeText={(txt) => update({ companyRegNumber: txt })}
                placeholder="J40/1234/2020"
                placeholderTextColor="#9ca3af"
              />
            </Field>

            <View style={styles.row}>
              <Field label={t('owner.email_companie')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.companyEmail} onChangeText={(txt) => update({ companyEmail: txt })} placeholder="contact@exemplu.ro" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" />
              </Field>
              <Field label={t('owner.telefon')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.companyPhone} onChangeText={(txt) => update({ companyPhone: txt })} placeholder="+40727..." placeholderTextColor="#9ca3af" keyboardType="phone-pad" />
              </Field>
            </View>
          </FormCard>

          <FormCard title={t('owner.pj') + ' — Reprezentant legal'}>
            <View style={styles.row}>
              <Field label={t('owner.reprezentant_nume')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.repLastName} onChangeText={(txt) => update({ repLastName: txt })} placeholder="Popescu" placeholderTextColor="#9ca3af" />
              </Field>
              <Field label={t('owner.reprezentant_prenume')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.repFirstName} onChangeText={(txt) => update({ repFirstName: txt })} placeholder="Ion" placeholderTextColor="#9ca3af" />
              </Field>
            </View>

            <Field label={t('owner.reprezentant_calitate')} required>
              <TextInput style={inputStyle} value={form.repCapacity} onChangeText={(txt) => update({ repCapacity: txt })} placeholder="Administrator" placeholderTextColor="#9ca3af" />
            </Field>
          </FormCard>

          <FormCard title={t('owner.adresa_sediu')}>
            <Field label={t('owner.judet')} required>
              <TextInput style={inputStyle} value={form.companyAddressCounty} onChangeText={(txt) => update({ companyAddressCounty: txt })} placeholder={t('owner.judet')} placeholderTextColor="#9ca3af" />
            </Field>
            <Field label={t('owner.localitate')} required>
              <TextInput style={inputStyle} value={form.companyAddressCity} onChangeText={(txt) => update({ companyAddressCity: txt })} placeholder={t('owner.localitate')} placeholderTextColor="#9ca3af" />
            </Field>
            <View style={styles.row}>
              <Field label={t('owner.strada')} required containerStyle={{ flex: 1 }}>
                <TextInput style={inputStyle} value={form.companyAddressStreet} onChangeText={(txt) => update({ companyAddressStreet: txt })} placeholder={t('owner.strada')} placeholderTextColor="#9ca3af" />
              </Field>
              <Field label={t('owner.numar')} required containerStyle={{ width: 80 }}>
                <TextInput style={inputStyle} value={form.companyAddressNumber} onChangeText={(txt) => update({ companyAddressNumber: txt })} placeholder={t('owner.numar')} placeholderTextColor="#9ca3af" />
              </Field>
            </View>
            <Field label={t('owner.cod_postal')} required>
              <TextInput style={inputStyle} value={form.companyAddressPostalCode} onChangeText={(txt) => update({ companyAddressPostalCode: txt })} placeholder="6 cifre" placeholderTextColor="#9ca3af" maxLength={6} keyboardType="number-pad" />
            </Field>
          </FormCard>

          <FormCard title={t('owner.leasing')}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{form.isLeasing ? t('common.yes') : t('common.no')}</Text>
              <Switch
                value={form.isLeasing}
                onValueChange={(v) => update({ isLeasing: v })}
                trackColor={{ false: colors.gray200, true: colors.orange }}
                thumbColor={colors.white}
              />
            </View>
          </FormCard>
        </>
      )}

      <AnimatedPressable>
        <Button onPress={handleNext} style={styles.nextButton}>{t('common.next')} →</Button>
      </AnimatedPressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  helper: { fontSize: 12, color: colors.gray500, marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  personTypeToggle: { flexDirection: 'row', borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray200 },
  personTypeBtn: { flex: 1, paddingVertical: 14 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { fontSize: 16, color: colors.gray600 },
  nextButton: { marginTop: 8, height: 52 },
});
