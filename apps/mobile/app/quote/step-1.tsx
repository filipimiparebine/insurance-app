import { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { updateQuoteFormData, getQuoteFormData, useQuoteForm, goNext, STEP_ROUTES } from '../../src/lib/quote-state';
import { validateStep1 } from '../../src/lib/mappers';
import FadeInView from '../../src/components/FadeInView';
import AnimatedPressable from '../../src/components/AnimatedPressable';
import { Stepper, HeaderText, Field, Button } from '../../src/components';
import { inputStyle } from '../../src/theme/tokens';
import { useLocale } from '../../src/lib/LocaleProvider';

const REGISTRATION_OPTIONS = ['registered', 'pending_registration', 'mayor_registered'] as const;
const USAGE_OPTIONS = ['Personal', 'Taxi', 'Curierat', 'Transport persoane', 'Transport marfă'];
const FUEL_OPTIONS = ['Motorină', 'Benzină', 'Electric', 'Hibrid', 'GPL', 'GNC'];

const USAGE_KEYS: Record<string, string> = { Personal: 'personal', Taxi: 'taxi', Curierat: 'curierat', 'Transport persoane': 'transport_persoane', 'Transport marfă': 'transport_marfa' };
const FUEL_KEYS: Record<string, string> = { Motorină: 'motorina', Benzină: 'benzina', Electric: 'electric', Hibrid: 'hibrid', GPL: 'gpl', GNC: 'gnc' };

export default function QuoteStep1() {
  const params = useLocalSearchParams<{ vin?: string; ocrMode?: string }>();
  const [form, setForm] = useState(getQuoteFormData());
  const { t } = useLocale();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { stepperCurrent } = useQuoteForm();

  const update = (updates: Partial<typeof form>) => {
    setForm((prev) => {
      const next = { ...prev, ...updates };
      updateQuoteFormData(next);
      return next;
    });
  };

  const handleNext = () => {
    const validation = validateStep1(form);
    if (!validation.valid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((e) => {
        const field = e.split(':')[0]?.trim() || 'form';
        errorMap[field] = e;
      });
      setErrors(errorMap);
      Alert.alert('Date incomplete', validation.errors.join('\n'));
      return;
    }
    setErrors({});
    const next = goNext();
    if (next && STEP_ROUTES[next]) {
      router.push(STEP_ROUTES[next] as any);
    }
  };

  useEffect(() => {
    if (params.vin) {
      setForm((prev) => {
        if (prev.vin) return prev;
        const next = { ...prev, vin: params.vin! };
        updateQuoteFormData(next);
        return next;
      });
    }
    if (params.ocrMode === 'true') {
      setForm((prev) => {
        const next = { ...prev, make: 'Auto-detected', model: 'Auto-detected' };
        updateQuoteFormData(next);
        return next;
      });
    }
  }, [params.vin, params.ocrMode]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FadeInView>
        <Stepper total={4} current={stepperCurrent} />
      </FadeInView>

      <FadeInView delay={80}>
        <HeaderText title={t('vehicle.title')} subtitle={t('wizard.vehicle_subtitle')} />
      </FadeInView>

      <Field label={t('vehicle.stare_label')} required>
        <View style={styles.chips}>
          {REGISTRATION_OPTIONS.map((opt) => (
            <Button
              key={opt}
              variant={form.registrationStatus === opt ? 'secondary' : 'outline'}
              onPress={() => update({ registrationStatus: opt })}
              style={styles.chip}
            >
              {opt === 'registered' ? t('vehicle.inmatriculat') : opt === 'pending_registration' ? t('vehicle.in_vederea_inmatricularii') : t('vehicle.inregistrat_primarie')}
            </Button>
          ))}
        </View>
      </Field>

      <Field label={t('vehicle.numar_inmatriculare')} required>
        <TextInput
          style={inputStyle}
          value={form.plateNumber}
          onChangeText={(t) => update({ plateNumber: t.toUpperCase() })}
          placeholder="ex: BV18BFG"
          placeholderTextColor="#9ca3af"
          autoCapitalize="characters"
        />
      </Field>

      <Field label={t('vehicle.vin')} required>
        <TextInput
          style={inputStyle}
          value={form.vin}
          onChangeText={(t) => update({ vin: t.toUpperCase() })}
          placeholder="17 caractere"
          placeholderTextColor="#9ca3af"
          maxLength={17}
          autoCapitalize="characters"
        />
      </Field>

      <View style={styles.row}>
        <Field label={t('vehicle.marca')} required containerStyle={{ flex: 1 }}>
          <TextInput style={inputStyle} value={form.make} onChangeText={(t) => update({ make: t })} placeholder="ex: Mercedes" placeholderTextColor="#9ca3af" />
        </Field>
        <Field label={t('vehicle.model')} required containerStyle={{ flex: 1 }}>
          <TextInput style={inputStyle} value={form.model} onChangeText={(t) => update({ model: t })} placeholder="ex: Sprinter" placeholderTextColor="#9ca3af" />
        </Field>
      </View>

      <Field label={t('vehicle.mod_utilizare')} required>
        <View style={styles.chips}>
          {USAGE_OPTIONS.map((opt) => (
            <Button
              key={opt}
              variant={form.usageType === opt.toLowerCase() ? 'secondary' : 'outline'}
              onPress={() => update({ usageType: opt.toLowerCase() })}
              style={styles.chip}
            >
              {t(`vehicle.usage_types.${USAGE_KEYS[opt]}`)}
            </Button>
          ))}
        </View>
      </Field>

      <View style={styles.row}>
        <Field label={t('vehicle.an_fabricatie')} required containerStyle={{ flex: 1 }}>
          <TextInput style={inputStyle} value={form.yearOfManufacture} onChangeText={(t) => update({ yearOfManufacture: t })} placeholder="2007" placeholderTextColor="#9ca3af" keyboardType="number-pad" />
        </Field>
        <Field label={t('vehicle.tip_combustibil')} required containerStyle={{ flex: 1 }}>
          <View style={styles.chips}>
            {FUEL_OPTIONS.slice(0, 3).map((opt) => (
              <Button
                key={opt}
                variant={form.fuelType === opt ? 'secondary' : 'outline'}
                onPress={() => update({ fuelType: opt })}
                style={styles.chip}
              >
                {t(`vehicle.fuel_types.${FUEL_KEYS[opt]}`)}
              </Button>
            ))}
          </View>
        </Field>
      </View>

      <View style={styles.row}>
        <Field label={t('vehicle.capacitate_cilindrica')} containerStyle={{ flex: 1 }}>
          <TextInput style={inputStyle} value={form.engineCapacity} onChangeText={(t) => update({ engineCapacity: t })} placeholder="2148" placeholderTextColor="#9ca3af" keyboardType="number-pad" />
        </Field>
        <Field label={t('vehicle.putere')} containerStyle={{ flex: 1 }}>
          <TextInput style={inputStyle} value={form.enginePower} onChangeText={(t) => update({ enginePower: t })} placeholder="65" placeholderTextColor="#9ca3af" keyboardType="number-pad" />
        </Field>
      </View>

      <View style={styles.row}>
        <Field label={t('vehicle.masa_maxima')} containerStyle={{ flex: 1 }}>
          <TextInput style={inputStyle} value={form.maxMass} onChangeText={(t) => update({ maxMass: t })} placeholder="2800" placeholderTextColor="#9ca3af" keyboardType="number-pad" />
        </Field>
        <Field label={t('vehicle.numar_locuri')} containerStyle={{ flex: 1 }}>
          <TextInput style={inputStyle} value={form.seatsCount} onChangeText={(t) => update({ seatsCount: t })} placeholder="2" placeholderTextColor="#9ca3af" keyboardType="number-pad" />
        </Field>
      </View>

      <AnimatedPressable>
        <Button onPress={handleNext} style={styles.nextButton}>{t('common.next')} →</Button>
      </AnimatedPressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8 },
  row: { flexDirection: 'row', gap: 12 },
  nextButton: { marginTop: 8, height: 52 },
});
