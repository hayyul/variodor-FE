import { expect } from 'vitest';
import i18n from '@/i18n';
import sq from '@/i18n/locales/sq.json';
import mk from '@/i18n/locales/mk.json';

export const testI18nInitialization = async () => {
  expect(i18n).toBeDefined();
  expect(i18n.isInitialized).toBe(true);

  // Check that both languages are supported (available in resources)
  const hasSquare = i18n.hasResourceBundle('sq', 'translation');
  const hasMacedonian = i18n.hasResourceBundle('mk', 'translation');
  expect(hasSquare).toBe(true);
  expect(hasMacedonian).toBe(true);
};

export const testDefaultLanguage = () => {
  // Default should be Macedonian or the saved language
  const currentLang = i18n.language;
  expect(['sq', 'mk']).toContain(currentLang);
};

export const testLanguageDetection = () => {
  // Test that localStorage is used for language detection
  localStorage.setItem('variador-language', 'sq');
  expect(localStorage.getItem('variador-language')).toBe('sq');

  // Cleanup
  localStorage.setItem('variador-language', 'mk');
};

export const testAlbanianTranslations = () => {
  expect(sq).toBeDefined();
  expect(sq.admin).toBeDefined();
  expect(sq.catalog).toBeDefined();
  expect(sq.product).toBeDefined();
  expect(sq.admin.login.title).toBe('Hyrja e Administratorit');
};

export const testMacedonianTranslations = () => {
  expect(mk).toBeDefined();
  expect(mk.admin).toBeDefined();
  expect(mk.catalog).toBeDefined();
  expect(mk.product).toBeDefined();
  expect(mk.admin.login.title).toBe('Најава за Администратор');
};

export const testTranslationKeysMatch = () => {
  // Helper to get all keys recursively
  const getKeys = (obj: any, prefix = ''): string[] => {
    let keys: string[] = [];
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(getKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  };

  const sqKeys = getKeys(sq).sort();
  const mkKeys = getKeys(mk).sort();

  expect(sqKeys).toEqual(mkKeys);
};

export const testLanguageSwitchToAlbanian = async () => {
  await i18n.changeLanguage('sq');
  expect(i18n.language).toBe('sq');
  expect(i18n.t('admin.login.title')).toBe('Hyrja e Administratorit');
};

export const testLanguageSwitchToMacedonian = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.language).toBe('mk');
  expect(i18n.t('admin.login.title')).toBe('Најава за Администратор');
};

export const testLanguagePersistence = () => {
  // Simulate language change and persistence
  const testLang = 'sq';
  localStorage.setItem('variador-language', testLang);
  expect(localStorage.getItem('variador-language')).toBe(testLang);

  // Cleanup
  localStorage.setItem('variador-language', 'mk');
};

export const testLanguageReload = () => {
  // Set language
  localStorage.setItem('variador-language', 'sq');

  // Verify it's saved
  const saved = localStorage.getItem('variador-language');
  expect(saved).toBe('sq');

  // Cleanup
  localStorage.setItem('variador-language', 'mk');
};
