import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Tab, Language } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';

const Header = React.memo(({ activeTab, setActiveTab, onMenuClick, onLogoClick }: { activeTab: Tab, setActiveTab: (tab: Tab) => void, onMenuClick: () => void, onLogoClick: () => void }) => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const langWrapperRef = useRef<HTMLDivElement>(null);

    const navItems: {id: Tab, label: string}[] = [
        { id: 'home', label: translations.nav_home[language] },
        { id: 'bible', label: translations.nav_bible[language] },
        { id: 'plans', label: translations.nav_plans[language] },
        { id: 'notes', label: translations.nav_notes[language] },
        { id: 'chat', label: translations.nav_chat[language] },
    ];

    const toggleLangDropdown = useCallback(() => {
        setIsLangDropdownOpen(prev => !prev);
    }, []);

    const handleLanguageSelect = useCallback((lang: Language) => {
        setLanguage(lang);
        setIsLangDropdownOpen(false);
    }, [setLanguage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langWrapperRef.current && !langWrapperRef.current.contains(event.target as Node)) {
                setIsLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="app-header">
             <button className="header-title-btn" onClick={onLogoClick} aria-label={translations.go_home_aria[language]}>
                 <h1 className="header-title">
                    <i className="material-icons logo-icon">spa</i>
                    <span>{translations.appName[language]}</span>
                 </h1>
             </button>
             <nav className="header-nav">
                 {navItems.map(item => (
                     <button 
                        key={item.id} 
                        className={`header-nav-button ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.label}
                    </button>
                 ))}
             </nav>
             <div className="header-actions">
                <div className="language-toggle-wrapper" ref={langWrapperRef}>
                    <button className="language-toggle-btn" onClick={toggleLangDropdown} aria-label={translations.change_language_aria[language]} aria-expanded={isLangDropdownOpen}>
                        {language.toUpperCase()}
                    </button>
                    {isLangDropdownOpen && (
                        <div className="language-dropdown">
                            <button className={`language-option ${language === 'pt' ? 'active' : ''}`} onClick={() => handleLanguageSelect('pt')}>{translations.language_pt[language]}</button>
                            <button className={`language-option ${language === 'en' ? 'active' : ''}`} onClick={() => handleLanguageSelect('en')}>{translations.language_en[language]}</button>
                            <button className={`language-option ${language === 'es' ? 'active' : ''}`} onClick={() => handleLanguageSelect('es')}>{translations.language_es[language]}</button>
                        </div>
                    )}
                </div>
                <button className="theme-toggle-btn" onClick={toggleTheme} aria-label={translations.toggle_theme_aria[language]}>
                     <i className="material-icons">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</i>
                </button>
                <button className="menu-toggle-btn" onClick={onMenuClick} aria-label={translations.open_menu_aria[language]}>
                    <i className="material-icons menu-icon">menu</i>
                </button>
            </div>
        </header>
    );
});

export default Header;