import React, { useCallback, useMemo, useState } from 'react';
import { Tab } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { getTodaysVerse } from '../hooks/useNotifications';

const VerseOfTheDay = React.memo(() => {
    const { language } = useLanguage();
    const verse = useMemo(() => getTodaysVerse(language), [language]);
    
    if (!verse) return null;

    return (
        <div className="verse-of-the-day-card">
            <h4>{translations.verse_of_the_day[language]}</h4>
            <p className="verse-text">"{verse.text}"</p>
            <p className="verse-ref">{verse.book} {verse.chapter}:{verse.verse}</p>
            <p className="verse-reflection">{verse.reflection}</p>
        </div>
    );
});

const Home = React.memo(({ setActiveTab, onSearch }: { setActiveTab: (tab: Tab) => void, onSearch: (query: string) => void }) => {
    const { language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    
    const goToBible = useCallback(() => setActiveTab('bible'), [setActiveTab]);
    const goToPlans = useCallback(() => setActiveTab('plans'), [setActiveTab]);
    const goToChat = useCallback(() => setActiveTab('chat'), [setActiveTab]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    return (
        <div className="home-container">
            <div className="home-intro">
                <i className="material-icons home-icon">spa</i>
                <h2>{translations.appName[language]}</h2>
                <p className="home-tagline">{translations.home_tagline[language]}</p>
            </div>
            <div className="home-actions">
                <button className="home-btn" onClick={goToBible}><i className="material-icons">book</i><span>{translations.home_read_bible[language]}</span></button>
                <button className="home-btn" onClick={goToPlans}><i className="material-icons">event_note</i><span>{translations.home_my_plans[language]}</span></button>
                <button className="home-btn" onClick={goToChat}><i className="material-icons">chat</i><span>{translations.nav_chat[language]}</span></button>
            </div>
            
            <form className="search-container" onSubmit={handleSearchSubmit} style={{width: '100%', maxWidth: '600px', margin: '1.5rem auto 0'}}>
                <div className="search-input-wrapper">
                    <i className="material-icons">search</i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={translations.bible_search_placeholder[language]}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label={translations.bible_search_placeholder[language]}
                    />
                </div>
            </form>

            <VerseOfTheDay />
        </div>
    );
});

export default Home;