import { useTranslation } from 'react-i18next';
import { useStore } from '../store';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('variador-language', lang);
  };

  return (
    <div className="flex items-center gap-2 border rounded-lg p-1 bg-white">
      <button
        onClick={() => handleLanguageChange('mk')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'mk'
            ? 'bg-red-600 text-white'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        data-testid="language-selector-mk"
      >
        🇲🇰 MK
      </button>
      <button
        onClick={() => handleLanguageChange('sq')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'sq'
            ? 'bg-red-600 text-white'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        data-testid="language-selector-sq"
      >
        🇦🇱 SQ
      </button>
    </div>
  );
}
