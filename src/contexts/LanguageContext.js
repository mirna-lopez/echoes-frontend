//Context for managing language state

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from '../data/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Try to get saved language from localStorage, default to English
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem('echoes_language');
    return saved || 'en';
  });

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('echoes_language', currentLanguage);
  }, [currentLanguage]);

  // Get translation for a given path (e.g., 'welcome.title')
  const t = (path) => {
    return getTranslation(currentLanguage, path);
  };

  // Change the current language
  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t, // translation function
    translations: translations[currentLanguage],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};