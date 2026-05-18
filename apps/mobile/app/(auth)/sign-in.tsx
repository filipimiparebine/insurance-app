import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { useLocale } from '../../src/lib/LocaleProvider';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useLocale();

  const handleSignIn = async () => {
    if (!isLoaded || !signIn) return;
    setError('');

    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(app)');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('common.auth_error'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brand}>{t('common.appName')}</Text>
        <Text style={styles.title}>{t('common.login')}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder={t('owner.email')}
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Parolă"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>{t('common.login')}</Text>
        </TouchableOpacity>

        <Link href="/sign-up" style={styles.link}>
          <Text style={styles.linkText}>{t('common.no_account')}</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#e5e7eb' },
  brand: { fontSize: 28, fontWeight: '600', color: '#0A0A0F', textAlign: 'center', marginBottom: 4, letterSpacing: -0.5 },
  title: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  error: { color: '#dc2626', fontSize: 14, marginBottom: 12, textAlign: 'center' },
  input: {
    height: 48, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12,
    paddingHorizontal: 16, fontSize: 16, color: '#111827', backgroundColor: '#fff', marginBottom: 12,
  },
  button: {
    height: 48, backgroundColor: '#FF6B1A', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#FF6B1A', fontSize: 14 },
});
