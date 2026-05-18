import { useState, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Modal, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

type ScanMode = 'talon' | 'ci';

interface CameraCaptureProps {
  visible: boolean;
  onCapture: (uris: string[]) => void;
  onClose: () => void;
  defaultMode?: ScanMode;
}

export default function CameraCapture({ visible, onCapture, onClose, defaultMode }: CameraCaptureProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScanMode>(defaultMode ?? 'talon');

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        onCapture([photo.uri]);
        onClose();
      }
    } catch {
      Alert.alert('Eroare', 'Nu s-a putut face fotografia. Încearcă din nou.');
    }
  };

  const handleGalleryPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisiune necesară', 'blaj.io are nevoie de acces la galerie.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 2,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      onCapture(result.assets.map((a) => a.uri));
      onClose();
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Permisiune cameră</Text>
          <Text style={styles.permissionText}>
            blaj.io are nevoie de acces la cameră pentru a scana talonul și CI-ul.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Permite accesul</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryFallback} onPress={handleGalleryPick}>
            <Text style={styles.galleryFallbackText}>Încarcă din galerie</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Anulează</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeTab, mode === 'talon' && styles.modeTabActive]}
                onPress={() => setMode('talon')}
              >
                <Text style={[styles.modeTabText, mode === 'talon' && styles.modeTabTextActive]}>
                  Talon
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeTab, mode === 'ci' && styles.modeTabActive]}
                onPress={() => setMode('ci')}
              >
                <Text style={[styles.modeTabText, mode === 'ci' && styles.modeTabTextActive]}>
                  CI / Buletin
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.headerButton} />
          </View>

          <View style={styles.overlay}>
            <View style={mode === 'talon' ? styles.talonFrame : styles.ciFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <Text style={styles.overlayLabel}>
              {mode === 'talon'
                ? 'Încadrează talonul în cadru'
                : 'Încadrează CI-ul în cadru'}
            </Text>
          </View>
        </CameraView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleGalleryPick} style={styles.galleryButton}>
            <Text style={styles.galleryLabelG}>G</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <View style={styles.galleryButton} />
        </View>
      </View>
    </Modal>
  );
}

const CORNER_SIZE = 30;
const CORNER_BORDER = 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerButtonText: { color: '#fff', fontSize: 22, fontWeight: '600' },
  modeToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 3 },
  modeTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18 },
  modeTabActive: { backgroundColor: '#FF6B1A' },
  modeTabText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '500' },
  modeTabTextActive: { color: '#fff', fontWeight: '600' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  talonFrame: {
    width: '80%',
    aspectRatio: 1.5,
    borderWidth: 0,
    position: 'relative',
  },
  ciFrame: {
    width: '65%',
    aspectRatio: 0.63,
    borderWidth: 0,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTL: {
    top: -4,
    left: -4,
    borderTopWidth: CORNER_BORDER,
    borderLeftWidth: CORNER_BORDER,
    borderColor: '#FF6B1A',
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: -4,
    right: -4,
    borderTopWidth: CORNER_BORDER,
    borderRightWidth: CORNER_BORDER,
    borderColor: '#FF6B1A',
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: -4,
    left: -4,
    borderBottomWidth: CORNER_BORDER,
    borderLeftWidth: CORNER_BORDER,
    borderColor: '#FF6B1A',
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: -4,
    right: -4,
    borderBottomWidth: CORNER_BORDER,
    borderRightWidth: CORNER_BORDER,
    borderColor: '#FF6B1A',
    borderBottomRightRadius: 4,
  },
  overlayLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginTop: 24,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 48,
    paddingTop: 20,
    paddingHorizontal: 40,
    backgroundColor: '#000',
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryLabelG: { color: '#fff', fontSize: 18, fontWeight: '600' },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionTitle: { color: '#fff', fontSize: 22, fontWeight: '600', marginBottom: 12 },
  permissionText: { color: '#9ca3af', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  permissionButton: {
    backgroundColor: '#FF6B1A',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 12,
  },
  permissionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  galleryFallback: { paddingVertical: 12, marginBottom: 12 },
  galleryFallbackText: { color: '#FF6B1A', fontSize: 16 },
  closeButton: { paddingVertical: 12 },
  closeButtonText: { color: '#9ca3af', fontSize: 16 },
});
