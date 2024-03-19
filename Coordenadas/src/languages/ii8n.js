import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './en.json';
import translationPT from './pt.json';
import translationES from './es.json';
import { Polyfill as IntlPolyfill } from 'intl-pluralrules'; // Importe o pacote IntlPolyfill

// Configure o polyfill IntlPolyfill para uso com i18next
i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    lng: 'pt',
    fallbackLng: 'pt',
    resources: {
      en: {
        translation: translationEN,
      },
      pt: {
        translation: translationPT,
      },
      es: {
        translation: translationES,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Configure o polyfill IntlPolyfill para uso com i18next
i18n.Intl = IntlPolyfill;

export default i18n;
