import React, { useCallback, useState, useEffect } from 'react';
import { Tab, VerseOfTheDay as VerseType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { getDynamicVerseOfTheDay } from '../utils/verseUtils';
import Logo from '../components/Logo';

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
                setVerse(null); // Garante que dados antigos ou corrompidos não sejam exibidos
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
                 <p className="verse-text"><em>Carregando versículo...</em></p>
            </div>
        );
    }

    if (!verse) return (
        <div className="verse-of-the-day-card">
             <h4>{translations.verse_of_the_day[language]}</h4>
             <p className="verse-text"><em>Não foi possível carregar o versículo do dia.</em></p>
        </div>
    );

    // Com as correções em verseUtils, verse.book agora é garantidamente uma string.
    // A função auxiliar getBookName foi removida para eliminar a causa do crash.
    return (
        <div className="verse-of-the-day-card">
            <h4>{translations.verse_of_the_day[language]}</h4>
            <p className="verse-text">"{verse.text}"</p>
            <p className="verse-ref">{verse.book} {verse.chapter}:{verse.verse}</p>
            {/* Renderiza a reflexão apenas se ela existir */}
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
                <Logo className="home-icon" />
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
