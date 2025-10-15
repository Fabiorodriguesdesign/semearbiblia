import React, { useCallback, useState, useEffect } from 'react';
import { Tab, VerseOfTheDay as VerseType } from '../tipos';
import { useLanguage } from '../contextos/LanguageContext';
import { translations } from '../dados/traduções';
import { getDynamicVerseOfTheDay } from '../utilitários/verseUtils';
import Logo from '../componentes/comum/Logo';

const VerseOfTheDay = React.memo(() => {
    const { language } = useLanguage();
    const [verse, setVerse] = useState<VerseType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVerse = async () => {
            setLoading(true);
            try {
                const dynamicVerse = await getDynamicVerseOfTheDay(language);
                setVerse(dynamicVerse);
            } catch (error) {
                console.error("Falha ao buscar o versículo do dia:", error);
                setVerse(null);
            } finally {
                setLoading(false);
            }
        };

        fetchVerse();
    }, [language]);
    
    if (loading) {
        return (
            <div className="verse-of-the-day-card">
                 <h4>{translations.verse_of_the_day[language]}</h4>
                 <p className="verse-text"><em>Carregando versículo e reflexão...</em></p>
            </div>
        );
    }

    if (!verse) {
        return (
             <div className="verse-of-the-day-card">
                 <h4>{translations.verse_of_the_day[language]}</h4>
                 <p className="verse-text"><em>Não foi possível carregar o versículo. Tente novamente mais tarde.</em></p>
            </div>
        )
    }

    return (
        <div className="verse-of-the-day-card">
            <h4>{translations.verse_of_the_day[language]}</h4>
            <p className="verse-text">\"{verse.text}\"</p>
            <p className="verse-ref">{verse.book} {verse.chapter}:{verse.verse}</p>
            {verse.reflection && <p className="verse-reflection">{verse.reflection}</p>}
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
                <Logo width={60} height={60} />
                <h2>{translations.appName[language]}</h2>
                <p className="home-tagline">{translations.home_tagline[language]}</p>
            </div>
            
            <form className="search-container" onSubmit={handleSearchSubmit}>
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

            <div className="home-actions">
                <button className="home-btn" onClick={goToBible}><i className="material-icons">book</i><span>{translations.home_read_bible[language]}</span></button>
                <button className="home-btn" onClick={goToPlans}><i className="material-icons">event_note</i><span>{translations.home_my_plans[language]}</span></button>
                <button className="home-btn" onClick={goToChat}><i className="material-icons">chat</i><span>{translations.nav_chat[language]}</span></button>
            </div>

            <VerseOfTheDay />
        </div>
    );
});

export default Home;
