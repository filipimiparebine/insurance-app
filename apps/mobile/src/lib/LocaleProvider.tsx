import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getLocales } from 'expo-localization';
import { setLocale as setSharedLocale, getLocale as getSharedLocale, t as sharedT, type Locale } from '@blaj/shared/i18n';

const LOCALE_STORAGE_KEY = 'blaj.locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ro',
  setLocale: () => {},
  t: sharedT,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSharedLocale());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const stored = await SecureStore.getItemAsync(LOCALE_STORAGE_KEY);
        if (stored === 'ro' || stored === 'en') {
          setSharedLocale(stored);
          setLocaleState(stored);
        } else {
          const deviceLang = getLocales()[0]?.languageCode;
          const detected: Locale = deviceLang === 'en' ? 'en' : 'ro';
          setSharedLocale(detected);
          setLocaleState(detected);
          await SecureStore.setItemAsync(LOCALE_STORAGE_KEY, detected);
        }
      } catch {
        const deviceLang = getLocales()[0]?.languageCode;
        const detected: Locale = deviceLang === 'en' ? 'en' : 'ro';
        setSharedLocale(detected);
        setLocaleState(detected);
      }
      setReady(true);
    }
    init();
  }, []);

  const setLocale = useCallback(async (l: Locale) => {
    setSharedLocale(l);
    setLocaleState(l);
    try {
      await SecureStore.setItemAsync(LOCALE_STORAGE_KEY, l);
    } catch {}
  }, []);

  if (!ready) return null;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: sharedT }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
