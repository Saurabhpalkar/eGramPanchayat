import { ref, computed } from 'vue';
import mrTranslations from '../locales/mr.json';
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';

export type Locale = 'mr' | 'en' | 'hi';

const currentLocale = ref<Locale>('mr');

const translationsMap: Record<Locale, any> = {
  mr: mrTranslations,
  en: enTranslations,
  hi: hiTranslations,
};

export function useI18n() {
  const locale = computed(() => currentLocale.value);

  function setLocale(newLocale: Locale) {
    currentLocale.value = newLocale;
    document.documentElement.lang = newLocale;
  }

  function t(path: string, fallback?: string): string {
    const keys = path.split('.');
    let current: any = translationsMap[currentLocale.value];

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English if missing
        let fallbackCurrent: any = translationsMap.en;
        for (const fk of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fk in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fk];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackCurrent === 'string' ? fallbackCurrent : (fallback || path);
      }
    }

    return typeof current === 'string' ? current : (fallback || path);
  }

  return {
    locale,
    setLocale,
    t,
  };
}
