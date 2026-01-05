import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'hi', name: 'हिंदी' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-full border border-gray-700">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          // Make buttons more compact
          className={`
            px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ease-in-out
            ${i18n.language === lang.code
              ? 'bg-white text-gray-900 shadow-sm'
              : 'bg-transparent text-gray-400 hover:text-white'
            }
          `}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}