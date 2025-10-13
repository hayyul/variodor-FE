import { describe, test, it } from 'vitest';
import * as tests from './tests';

describe('[INIT] 0. Component Translation', () => {
  describe('[IN] 1. Admin Component Translation', () => {
    test('1.1 -> Translate LoginScreen labels', tests.testLoginTranslation);
    test('1.2 -> Translate Admin panel headers', tests.testAdminHeaderTranslation);
    test('1.3 -> Translate form labels and buttons', tests.testAdminFormTranslation);
    test('1.4 -> Translate table headers and actions', tests.testAdminTableTranslation);
  });

  describe('[PROC] 2. Catalog Component Translation', () => {
    test('2.1 -> Translate category labels', tests.testCategoryTranslation);
    test('2.2 -> Translate search placeholder', tests.testSearchTranslation);
    test('2.3 -> Translate contact section', tests.testContactTranslation);
    test('2.4 -> Translate empty state messages', tests.testEmptyStateTranslation);
  });

  describe('[OUT] 3. Product Component Translation', () => {
    test('3.1 -> Translate back button', tests.testBackButtonTranslation);
    test('3.2 -> Translate specifications header', tests.testSpecsHeaderTranslation);
    test('3.3 -> Translate contact button', tests.testContactButtonTranslation);
    test('3.4 -> Translate catalog link', tests.testCatalogLinkTranslation);
  });

  describe('[SYNC] 4. Dynamic Translation Verification', () => {
    test('4.1 -> All components use t() function', tests.testTranslationFunctionUsage);
    test('4.2 -> No hardcoded text in Macedonian', tests.testNoHardcodedMacedonian);
    test('4.3 -> All translation keys exist', tests.testAllKeysExist);
    test('4.4 -> Components re-render on language change', tests.testComponentRerender);
  });
});
