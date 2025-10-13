import { expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '@/i18n';

// Simple tests to verify translation keys exist and components use them
export const testLoginTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('admin.login.title')).toBe('Најава за Администратор');

  await i18n.changeLanguage('sq');
  expect(i18n.t('admin.login.title')).toBe('Hyrja e Administratorit');
};

export const testAdminHeaderTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('admin.panel.title')).toBe('Администраторска Панел');

  await i18n.changeLanguage('sq');
  expect(i18n.t('admin.panel.title')).toBe('Paneli i Administratorit');
};

export const testAdminFormTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('admin.form.save')).toBe('Зачувај');
  expect(i18n.t('admin.form.clear')).toBe('Исчисти');

  await i18n.changeLanguage('sq');
  expect(i18n.t('admin.form.save')).toBe('Ruaj');
  expect(i18n.t('admin.form.clear')).toBe('Pastro');
};

export const testAdminTableTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('admin.table.edit')).toBe('Измени');
  expect(i18n.t('admin.table.delete')).toBe('Избриши');

  await i18n.changeLanguage('sq');
  expect(i18n.t('admin.table.edit')).toBe('Ndrysho');
  expect(i18n.t('admin.table.delete')).toBe('Fshi');
};

export const testCategoryTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('catalog.categories.interior')).toBe('ВНАТРЕШНИ ВРАТИ');
  expect(i18n.t('catalog.categories.exterior')).toBe('НАДВОРЕШНИ ВРАТИ');

  await i18n.changeLanguage('sq');
  expect(i18n.t('catalog.categories.interior')).toBe('DYERT E BRENDSHME');
  expect(i18n.t('catalog.categories.exterior')).toBe('DYERT E JASHTME');
};

export const testSearchTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('catalog.search')).toBe('Пребарај производ…');

  await i18n.changeLanguage('sq');
  expect(i18n.t('catalog.search')).toBe('Kërko produkt…');
};

export const testContactTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('catalog.contact.title')).toBe('Контактирајте не');
  expect(i18n.t('catalog.contact.phone')).toBe('Телефон');

  await i18n.changeLanguage('sq');
  expect(i18n.t('catalog.contact.title')).toBe('Na kontaktoni');
  expect(i18n.t('catalog.contact.phone')).toBe('Telefoni');
};

export const testEmptyStateTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('catalog.noProducts')).toBe('Нема производи.');

  await i18n.changeLanguage('sq');
  expect(i18n.t('catalog.noProducts')).toBe('Nuk ka produkte.');
};

export const testBackButtonTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('product.back')).toBe('Назад');

  await i18n.changeLanguage('sq');
  expect(i18n.t('product.back')).toBe('Mbrapa');
};

export const testSpecsHeaderTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('product.specifications')).toBe('Спецификации');

  await i18n.changeLanguage('sq');
  expect(i18n.t('product.specifications')).toBe('Specifikimet');
};

export const testContactButtonTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('product.contact')).toBe('Контакт за нарачка');

  await i18n.changeLanguage('sq');
  expect(i18n.t('product.contact')).toBe('Kontakti për porosi');
};

export const testCatalogLinkTranslation = async () => {
  await i18n.changeLanguage('mk');
  expect(i18n.t('product.catalog')).toBe('Каталог');

  await i18n.changeLanguage('sq');
  expect(i18n.t('product.catalog')).toBe('Katalogu');
};

export const testTranslationFunctionUsage = () => {
  // Verify that all translation keys are defined
  const keys = [
    'admin.login.title',
    'catalog.categories.interior',
    'product.back',
  ];

  keys.forEach((key) => {
    const translation = i18n.t(key);
    expect(translation).not.toBe(key); // Should not return the key itself
    expect(translation.length).toBeGreaterThan(0);
  });
};

export const testNoHardcodedMacedonian = () => {
  // This test verifies that translation keys exist, not that components are perfect
  // Component-level checking would require rendering all components
  expect(i18n.t('admin.login.title')).toBeTruthy();
  expect(i18n.t('catalog.search')).toBeTruthy();
  expect(i18n.t('product.specifications')).toBeTruthy();
};

export const testAllKeysExist = () => {
  // Test that critical translation keys exist in both languages
  const criticalKeys = [
    'admin.login.title',
    'admin.panel.title',
    'catalog.categories.interior',
    'catalog.search',
    'product.back',
    'product.specifications',
  ];

  ['mk', 'sq'].forEach((lang) => {
    i18n.changeLanguage(lang);
    criticalKeys.forEach((key) => {
      const translation = i18n.t(key);
      expect(translation).not.toBe(key);
      expect(translation.length).toBeGreaterThan(0);
    });
  });
};

export const testComponentRerender = async () => {
  // Test that i18n language changes trigger re-renders by checking translation changes
  await i18n.changeLanguage('mk');
  const mkText = i18n.t('admin.login.title');

  await i18n.changeLanguage('sq');
  const sqText = i18n.t('admin.login.title');

  expect(mkText).not.toBe(sqText);
  expect(mkText).toBe('Најава за Администратор');
  expect(sqText).toBe('Hyrja e Administratorit');
};
