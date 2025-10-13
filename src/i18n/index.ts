import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import sq from './locales/sq.json';
import mk from './locales/mk.json';

const savedLanguage = localStorage.getItem('variador-language') || 'mk';

i18n.use(initReactI18next).init({
  resources: {
    sq: { translation: sq },
    mk: { translation: mk },
  },
  lng: savedLanguage,
  fallbackLng: 'mk',
  supportedLngs: ['sq', 'mk'],
  preload: ['sq', 'mk'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
