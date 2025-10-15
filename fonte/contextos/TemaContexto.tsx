import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { Theme } from '../tipos';

type ThemeContextType = { theme: Theme; toggleTheme: () => void; };
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    return context;
};

export const ThemeProvider = React.memo(({ children }: React.PropsWithChildren<{}>) => {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
    
    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const toggleTheme = useCallback(() => setTheme(prev => (prev === 'light' ? 'dark' : 'light')), []);
    
    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
    
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
});
