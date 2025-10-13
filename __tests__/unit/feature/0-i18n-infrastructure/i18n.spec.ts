import { describe, test, it } from 'vitest';
import * as tests from './tests';

describe('[INIT] 0. i18n Infrastructure', () => {
  describe('[IN] 1. Configuration Setup', () => {
    test('1.1 -> Initialize i18next with Albanian and Macedonian', tests.testI18nInitialization);
    test('1.2 -> Set default language to Macedonian', tests.testDefaultLanguage);
    test('1.3 -> Load language detection from localStorage', tests.testLanguageDetection);
  });

  describe('[PROC] 2. Translation Files', () => {
    test('2.1 -> Create Albanian translation file', tests.testAlbanianTranslations);
    test('2.2 -> Create Macedonian translation file', tests.testMacedonianTranslations);
    test('2.3 -> All translation keys match between languages', tests.testTranslationKeysMatch);
  });

  describe('[OUT] 3. Translation Keys', () => {
    it.todo('3.1 -> Admin panel translations (login, buttons, labels)');
    it.todo('3.2 -> Catalog translations (categories, search, products)');
    it.todo('3.3 -> Product page translations (back, specs, contact)');
    it.todo('3.4 -> Common translations (footer, navigation)');
    it.todo('3.5 -> Contact page translations');
  });

  describe('[SYNC] 4. Language Switching', () => {
    test('4.1 -> Switch from Macedonian to Albanian', tests.testLanguageSwitchToAlbanian);
    test('4.2 -> Switch from Albanian to Macedonian', tests.testLanguageSwitchToMacedonian);
    test('4.3 -> Persist language choice to localStorage', tests.testLanguagePersistence);
    test('4.4 -> Reload preserves language choice', tests.testLanguageReload);
  });
});
