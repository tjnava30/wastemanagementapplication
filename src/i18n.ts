import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import translationEN from './locales/en/translation.json';
import translationTA from './locales/ta/translation.json';
import translationHI from './locales/hi/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  ta: {
    translation: translationTA
  },
  hi: {
    translation: translationHI
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // use english if selected language is not available
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;