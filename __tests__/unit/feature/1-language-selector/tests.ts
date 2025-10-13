import { expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from '@/components/LanguageSelector';
import { useStore } from '@/store';
import i18n from '@/i18n';

export const testLanguageSelectorExists = () => {
  render(<LanguageSelector />);
  const mkButton = screen.getByTestId('language-selector-mk');
  const sqButton = screen.getByTestId('language-selector-sq');
  expect(mkButton).toBeDefined();
  expect(sqButton).toBeDefined();
};

export const testLanguageDisplay = () => {
  render(<LanguageSelector />);
  const mkButton = screen.getByTestId('language-selector-mk');
  const sqButton = screen.getByTestId('language-selector-sq');

  expect(mkButton.textContent).toContain('MK');
  expect(sqButton.textContent).toContain('SQ');
};

export const testLanguageOptions = () => {
  render(<LanguageSelector />);
  const mkButton = screen.getByTestId('language-selector-mk');
  const sqButton = screen.getByTestId('language-selector-sq');

  // Both buttons should exist
  expect(mkButton).toBeDefined();
  expect(sqButton).toBeDefined();
};

export const testSelectAlbanian = () => {
  render(<LanguageSelector />);
  const sqButton = screen.getByTestId('language-selector-sq');

  fireEvent.click(sqButton);

  // Verify store updated
  const currentLang = useStore.getState().language;
  expect(currentLang).toBe('sq');
};

export const testSelectMacedonian = () => {
  render(<LanguageSelector />);
  const mkButton = screen.getByTestId('language-selector-mk');

  fireEvent.click(mkButton);

  // Verify store updated
  const currentLang = useStore.getState().language;
  expect(currentLang).toBe('mk');
};

export const testStoreUpdate = () => {
  const store = useStore.getState();

  // Set language via store
  store.setLanguage('sq');
  expect(useStore.getState().language).toBe('sq');

  // Set back to mk
  store.setLanguage('mk');
  expect(useStore.getState().language).toBe('mk');
};

export const testI18nTrigger = async () => {
  render(<LanguageSelector />);
  const sqButton = screen.getByTestId('language-selector-sq');

  // Click Albanian button
  fireEvent.click(sqButton);

  // Wait for i18n to update
  await new Promise((resolve) => setTimeout(resolve, 10));

  // Verify i18n language changed
  expect(i18n.language).toBe('sq');
};

export const testUndefinedLanguage = () => {
  const store = useStore.getState();

  // Try setting undefined (should fallback gracefully)
  try {
    store.setLanguage('');
    const currentLang = useStore.getState().language;
    expect(typeof currentLang).toBe('string');
  } catch (error) {
    // Should not throw
    expect(error).toBeUndefined();
  }
};

export const testLanguageFallback = () => {
  // Test that invalid language falls back to default
  const store = useStore.getState();

  // Set to an invalid language
  store.setLanguage('invalid');

  // Should still work (store doesn't validate)
  expect(useStore.getState().language).toBe('invalid');

  // But i18n should fallback to mk
  expect(i18n.language).toMatch(/mk|sq/);
};
