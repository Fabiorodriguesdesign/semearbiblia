

import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { ReadingPlan, SearchResult, ChapterType, Bookmark } from '../types';
import { usePlans } from '../contexts/PlansContext';
import { useBible } from '../contexts/BibleContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { getBookName, getChapterCount, getCanonicalName } from '../data/bibleBooks';
import { dynamicPlanDefinitions, getReadingPlansData } from '../data/readingPlans';
import { parseDetailedReference } from '../utils/verseParser';
import { debounce } from '../utils/utils';
import { translations } from '../data/translations';
import ReadingView from '../components/bible/ReadingView';

// Lazy load the components for better performance
const BibleView = lazy(() => import('./BibleView'));
const ApocryphaView = lazy(() => import('./ApocryphaView'));
const ArchaeologyView = lazy(() => import('./ArchaeologyView'));
const ThematicView = lazy(() => import('./ThematicView'));
const HarmonyView = lazy(() => import('./HarmonyView'));


const SearchResultsView = React.memo(({ results, onResultClick }: { results: SearchResult[], onResultClick: (result: SearchResult) => void }) => {
    return (
        <div className="search-results-container">
            {results.map((result, index) => (
                <div key={index} className="search-result-item" onClick={() => onResultClick(result)} role="button" tabIndex={0}>
                    <div className="search-result-ref">{result.book} {result.chapter}:{result.verse}</div>
                    <p className="search-result-text">{result.text}</p>
                </div>
            ))}
        </div>
    );
});

const LoadingSpinner = () => (
    <div className="spinner-container" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
    </div>
);

interface BibleDirectoryProps {
    verseToNavigate: Bookmark | null;
    onVerseNavigated: () => void;
    initialQuery?: string | null;
    onSearchHandled?: () => void;
}

const BibleDirectory = ({ verseToNavigate, onVerseNavigated, initialQuery, onSearchHandled }: BibleDirectoryProps) => {
    const { addPlan } = usePlans();
    const [view, setView] = useState<'index' | 'bible' | 'apocrypha' | 'archaeology' | 'themes' | 'gospelHarmony'>('index');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [reading, setReading] = useState<{ bookName: string, chapterNumber: number, chapterData: ChapterType, verseToHighlight?: number } | null>(null);
    const { getChapterContent } = useBible();
    const { language } = useLanguage();
    
    useEffect(() => {
        if (initialQuery && onSearchHandled) {
            setSearchQuery(initialQuery);
            onSearchHandled();
        }
    }, [initialQuery, onSearchHandled]);

    useEffect(() => {
        const navigateToVerse = async () => {
            if (verseToNavigate) {
                const { book, chapter, verse } = verseToNavigate;
                
                const canonicalBookName = getCanonicalName(book, 'pt') || getCanonicalName(book, 'en') || getCanonicalName(book, 'es');
                if (!canonicalBookName) return;

                const translatedBookName = getBookName(canonicalBookName, language);
                const chapterData = await getChapterContent(canonicalBookName, chapter);

                if (chapterData) {
                    setReading({
                        bookName: translatedBookName,
                        chapterNumber: chapter,
                        chapterData: chapterData,
                        verseToHighlight: verse
                    });
                }
                onVerseNavigated();
            }
        };
        navigateToVerse();
    }, [verseToNavigate, onVerseNavigated, getChapterContent, language]);
    
    const goBackToIndex = useCallback(() => setView('index'), []);

    const debouncedSearch = useMemo(() => debounce(async (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        
        setIsSearching(true);
        const parsedRef = parseDetailedReference(trimmedQuery, language);

        if (parsedRef) {
            const { book: canonicalBookName, chapter, verseStart } = parsedRef;
            const translatedBookName = getBookName(canonicalBookName, language);
            const result: SearchResult = {
                book: translatedBookName,
                chapter: parseInt(chapter, 10),
                verse: parseInt(verseStart, 10),
                text: `Clique para ler ${translatedBookName} ${chapter}:${verseStart}`
            };
            setSearchResults([result]);
        } else {
            setSearchResults([]);
        }
        setIsSearching(false);
    }, 500), [language]);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);
    
    const handleResultClick = useCallback(async (result: SearchResult) => {
        const canonicalBookName = getCanonicalName(result.book, language);
        if (!canonicalBookName) return;

        const chapterData = await getChapterContent(canonicalBookName, result.chapter);
        if (chapterData) {
            setReading({
                bookName: result.book,
                chapterNumber: result.chapter,
                chapterData: chapterData,
                verseToHighlight: result.verse
            });
        }
    }, [getChapterContent, language]);

    const handleChapterChange = useCallback(async (newChapter: number) => {
        if (!reading) return;
        
        const { bookName } = reading;
        const canonicalBookName = getCanonicalName(bookName, language);
        if (!canonicalBookName) return;
        
        const chapterData = await getChapterContent(canonicalBookName, newChapter);
        
        if (chapterData) {
            setReading({
                bookName,
                chapterNumber: newChapter,
                chapterData: chapterData,
            });
            window.scrollTo(0, 0);
        }
    }, [reading, getChapterContent, language]);

    const handleBookChange = useCallback(async (newCanonicalBookName: string) => {
        if (!reading) return;

        const newBookTotalChapters = getChapterCount(newCanonicalBookName);
        const targetChapter = Math.min(reading.chapterNumber, newBookTotalChapters);

        const newBookName = getBookName(newCanonicalBookName, language);
        const chapterData = await getChapterContent(newCanonicalBookName, targetChapter);

        if(chapterData) {
            setReading({
                bookName: newBookName,
                chapterNumber: targetChapter,
                chapterData: chapterData
            });
            window.scrollTo(0, 0);
        }
    }, [reading, language, getChapterContent]);
    
    const handleAddPlanClick = useCallback((plan: ReadingPlan | undefined) => {
        if (plan) {
            addPlan(plan);
        }
    }, [addPlan]);

    const directoryItems = useMemo(() => [
        {
            id: 'bible',
            icon: 'book',
            title: translations.dir_read_bible[language],
            description: translations.bible_description[language],
            action: () => setView('bible'),
            addPlanAction: () => handleAddPlanClick(getReadingPlansData(language).find(p => p.id === 'anual_tradicional')),
        },
        {
            id: 'gospelHarmony',
            icon: 'compare_arrows',
            title: translations.dir_gospel_harmony[language],
            description: translations.harmony_description[language],
            action: () => setView('gospelHarmony'),
            addPlanAction: () => handleAddPlanClick(dynamicPlanDefinitions.gospelHarmony),
        },
        {
            id: 'themes',
            icon: 'local_offer',
            title: translations.dir_thematic[language],
            description: translations.thematic_description[language],
            action: () => setView('themes'),
            addPlanAction: () => handleAddPlanClick(dynamicPlanDefinitions.themes),
        },
        {
            id: 'apocrypha',
            icon: 'history_edu',
            title: translations.dir_apocrypha[language],
            description: translations.apocrypha_description[language],
            action: () => setView('apocrypha'),
            addPlanAction: () => handleAddPlanClick(dynamicPlanDefinitions.apocrypha),
        },
        {
            id: 'archaeology',
            icon: 'public',
            title: translations.dir_archaeology[language],
            description: translations.archaeology_description[language],
            action: () => setView('archaeology'),
            addPlanAction: () => handleAddPlanClick(dynamicPlanDefinitions.archaeology),
        },
    ], [language, handleAddPlanClick]);

    if (reading) {
        const canonicalBookName = getCanonicalName(reading.bookName, language) || '';
        return <ReadingView 
                    bookName={reading.bookName} 
                    chapterNumber={reading.chapterNumber} 
                    chapterData={reading.chapterData} 
                    onBack={() => setReading(null)}
                    totalChapters={getChapterCount(canonicalBookName)}
                    onChapterChange={handleChapterChange}
                    onBookChange={handleBookChange}
                    verseToHighlight={reading.verseToHighlight}
                />
    }

    const renderIndex = () => (
        <div className="card">
            <h2>{translations.bible_directory_title[language]}</h2>
            <p>{translations.bible_directory_desc[language]}</p>
            
            <div className="search-container">
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
            </div>

            {isSearching && (
                <div className="search-loading">
                    <div className="spinner"></div>
                    <p>{translations.search_loading[language]}</p>
                </div>
            )}

            {!isSearching && searchQuery && searchResults.length > 0 && (
                <SearchResultsView results={searchResults} onResultClick={handleResultClick} />
            )}
            
            {!isSearching && searchQuery && searchResults.length === 0 && (
                <div className="search-empty">
                    <p>{translations.search_no_results[language]} "{searchQuery}".</p>
                </div>
            )}
            
            {!searchQuery && (
                <div className="directory-card-grid">
                    {directoryItems.map(item => (
                        <div key={item.id} className="directory-card">
                            <div className="directory-card__header">
                                <i className="material-icons directory-card__icon">{item.icon}</i>
                                <h3 className="directory-card__title">{item.title}</h3>
                            </div>
                            <p className="directory-card__description">{item.description}</p>
                            <div className="directory-card__actions">
                                <button className="directory-card__action-primary" onClick={item.action}>
                                    <i className="material-icons">arrow_forward</i>
                                    <span>{translations.explore[language]}</span>
                                </button>
                                <button className="directory-card__action-secondary" onClick={item.addPlanAction}>
                                    <i className="material-icons">add</i>
                                    <span>{translations.add_study_plan[language]}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {view === 'index' && renderIndex()}
            {view === 'bible' && <BibleView onBack={goBackToIndex} onAddPlan={addPlan} />}
            {view === 'apocrypha' && <ApocryphaView onBack={goBackToIndex} onAddPlan={addPlan} />}
            {view === 'archaeology' && <ArchaeologyView onBack={goBackToIndex} onAddPlan={addPlan} />}
            {view === 'themes' && <ThematicView onBack={goBackToIndex} onAddPlan={addPlan} />}
            {view === 'gospelHarmony' && <HarmonyView onBack={goBackToIndex} />}
        </Suspense>
    );
};

export default BibleDirectory;
