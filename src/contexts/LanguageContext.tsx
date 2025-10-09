import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { Language } from '../types';

type LanguageContextType = { language: Language; setLanguage: (lang: Language) => void; };
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};

export const LanguageProvider = React.memo(({ children }: React.PropsWithChildren<{}>) => {
    const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('semear_language') as Language) || 'pt');
    
    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('semear_language', lang);
        document.documentElement.lang = lang;
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);
    
    const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
});
