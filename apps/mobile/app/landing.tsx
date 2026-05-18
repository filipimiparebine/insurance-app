import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, ScrollView, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import CameraCapture from '../src/components/CameraCapture';
import FadeInView from '../src/components/FadeInView';
import { useLocale } from '../src/lib/LocaleProvider';

export default function LandingScreen() {
  const { isSignedIn } = useAuth();
  const [vinSearch, setVinSearch] = useState('');
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const { t } = useLocale();

  const handleSearch = () => {
    if (!vinSearch.trim()) {
      Alert.alert(t('common.search'), t('common.search_placeholder'));
      return;
    }
    router.push({
      pathname: '/quote/step-1',
      params: { vin: vinSearch.trim().toUpperCase() },
    });
  };

  const navigateWithDocuments = (uris: string[]) => {
    router.push({
      pathname: '/quote/step-1',
      params: {
        documentUris: JSON.stringify(uris),
        ocrMode: 'true',
      },
    });
  };

  const handleGalleryPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('common.upload_documents'), t('errors.server.generic'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 2,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      navigateWithDocuments(result.assets.map((a) => a.uri));
    }
  };

  const handleCameraCapture = (uris: string[]) => {
    navigateWithDocuments(uris);
  };

  return (
    <ScrollView style={styles.container}>
      <FadeInView>
        <View style={styles.hero}>
          <Text style={styles.brand}>{t('common.appName')}</Text>
          <Text style={styles.eyebrow}>{t('landing.eyebrow')}</Text>
          <Text style={styles.h1}>{t('landing.hero')}</Text>
          <Text style={styles.subtitle}>{t('landing.subtitle')}</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('common.search_placeholder')}
              placeholderTextColor="#9ca3af"
              value={vinSearch}
              onChangeText={setVinSearch}
              autoCapitalize="characters"
              maxLength={17}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>{t('common.search')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cameraButton} onPress={() => setShowCameraCapture(true)}>
            <Text style={styles.cameraButtonText}>{t('common.upload_documents')}</Text>
          </TouchableOpacity>

          <Text style={styles.trustBadges}>{t('landing.trust_badges')}</Text>
        </View>
      </FadeInView>

      <FadeInView delay={100}>
        <View style={styles.howItWorks}>
        <Text style={styles.sectionEyebrow}>{t('landing.process_badge')}</Text>
        <Text style={styles.sectionTitle}>{t('landing.process_title')}</Text>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>01</Text>
          <Text style={styles.stepTitle}>{t('landing.step1_title')}</Text>
          <Text style={styles.stepDesc}>{t('landing.step1_desc')}</Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>02</Text>
          <Text style={styles.stepTitle}>{t('landing.step2_title')}</Text>
          <Text style={styles.stepDesc}>{t('landing.step2_desc')}</Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>03</Text>
          <Text style={styles.stepTitle}>{t('landing.step3_title')}</Text>
          <Text style={styles.stepDesc}>{t('landing.step3_desc')}</Text>
        </View>
        </View>
      </FadeInView>

      <FadeInView delay={200}>
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>{t('landing.cta_title')}</Text>
          <Text style={styles.ctaSubtitle}>{t('landing.cta_subtitle')}</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push(isSignedIn ? '/(app)' : '/sign-in')}>
            <Text style={styles.ctaButtonText}>{t('landing.calculate_price')}</Text>
          </TouchableOpacity>
        </View>
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { padding: 24, paddingTop: 60, alignItems: 'center' },
  brand: { fontSize: 28, fontWeight: '600', color: '#0A0A0F', letterSpacing: -0.5, marginBottom: 8 },
  eyebrow: { fontSize: 13, fontWeight: '500', color: '#FF6B1A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  h1: { fontSize: 36, fontWeight: '600', color: '#0A0A0F', textAlign: 'center', lineHeight: 42, marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', lineHeight: 24, marginBottom: 24, paddingHorizontal: 16 },
  searchContainer: { flexDirection: 'row', gap: 8, width: '100%', maxWidth: 400, marginBottom: 12 },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  searchButton: {
    height: 50,
    backgroundColor: '#FF6B1A',
    borderRadius: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  documentRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    maxWidth: 400,
    marginBottom: 12,
  },
  docOption: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FF6B1A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  docOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  docOptionIconText: { fontSize: 16 },
  docOptionLabel: { color: '#FF6B1A', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  cameraButton: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#FF6B1A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
  },
  cameraButtonText: { color: '#FF6B1A', fontSize: 16, fontWeight: '500' },
  trustBadges: { fontSize: 13, color: '#9ca3af', marginTop: 8 },
  howItWorks: { padding: 24, backgroundColor: '#f9fafb' },
  sectionEyebrow: { fontSize: 13, fontWeight: '500', color: '#FF6B1A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  sectionTitle: { fontSize: 28, fontWeight: '600', color: '#0A0A0F', marginBottom: 24 },
  step: { marginBottom: 24 },
  stepNumber: { fontSize: 32, fontWeight: '600', color: '#FF6B1A', marginBottom: 4 },
  stepTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  stepDesc: { fontSize: 15, color: '#6b7280', lineHeight: 22 },
  ctaSection: { padding: 32, alignItems: 'center' },
  ctaTitle: { fontSize: 28, fontWeight: '600', color: '#0A0A0F', textAlign: 'center', marginBottom: 8 },
  ctaSubtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  ctaButton: {
    height: 52,
    backgroundColor: '#FF6B1A',
    borderRadius: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
