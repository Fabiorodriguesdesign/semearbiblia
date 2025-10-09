import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ReadingPlan, SearchResult, ThematicReadingItem, GospelHarmonyItem, ChapterType, Bookmark, Language } from '../types';
import { usePlans } from '../contexts/PlansContext';
import { useBible } from '../contexts/BibleContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { getBookList, getBookName, getChapterCount, getCanonicalName, getGospelNameFromKey } from '../data/bibleBooks';
import { dynamicPlanDefinitions, getReadingPlansData } from '../data/readingPlans';
import { archaeologyData } from '../data/archaeologyData';
import { thematicReadingData } from '../data/thematicData';
import { gospelHarmonyData } from '../data/harmonyData';
import { parseDetailedReference } from '../utils/verseParser';
import { debounce, normalizeString } from '../utils/utils';
import { translations } from '../data/translations';
import BibleBookView from '../components/bible/BibleBookView';
import BackButton from '../components/common/BackButton';
import ReadingView from '../components/bible/ReadingView';

const BibleView = React.memo(({ onBack, onAddPlan }: { onBack: () => void, onAddPlan: (plan: ReadingPlan) => void; }) => {
    const { language } = useLanguage();
    const bookSections = useMemo(() => [
        { title: translations.old_testament[language], books: getBookList('ot', language) }, 
        { title: translations.deuterocanonical[language], books: getBookList('dc', language), className: 'deuterocanonical-section' }, 
        { title: translations.new_testament[language], books: getBookList('nt', language) }
    ], [language]);

    return (
        <BibleBookView 
            onBack={onBack} 
            onAddPlan={onAddPlan} 
            title={translations.bible_title[language]}
            description={translations.bible_description[language]}
            bookSections={bookSections} 
        />
    );
});

const Apocrypha = React.memo(({ onBack, onAddPlan }: { onBack: () => void, onAddPlan: (plan: ReadingPlan) => void; }) => {
    const { language } = useLanguage();
    const bookSections = useMemo(() => [{ title: translations.selected_texts[language], books: getBookList('ap', language) }], [language]);

    return (
     <BibleBookView 
        onBack={onBack} 
        onAddPlan={onAddPlan} 
        title={translations.apocrypha_title[language]}
        description={translations.apocrypha_description[language]}
        bookSections={bookSections} 
    />
    );
});

const Archaeology = React.memo(({ onBack, onAddPlan }: { onBack: () => void, onAddPlan: (plan: ReadingPlan) => void; }) => {
    const { language } = useLanguage();
    const handleAddArchaeologyPlan = useCallback((item: { title: string; description: string }) => {
        const plan: ReadingPlan = {
            id: `arch_${item.title.replace(/\s/g, '_').slice(0, 20)}`,
            title: `Estudo: ${item.title}`,
            description: item.description,
        };
        onAddPlan(plan);
    }, [onAddPlan]);

    return (
        <div className="card archaeology-container">
            <BackButton onClick={onBack} text={translations.back[language]} />
            <h2>{translations.archaeology_title[language]}</h2>
            <p>{translations.archaeology_description[language]}</p>
            {archaeologyData.map(category => (
                <div key={category.category} className="archaeology-category">
                    <h3 className="archaeology-category-title">{category.category}</h3>
                    <div className="archaeology-items-grid">
                        {category.items.map(item => (
                            <div key={item.title} className="archaeology-item">
                                <div className="archaeology-item-content">
                                    <h4 className="archaeology-item-title">{item.title}</h4>
                                    <p className="archaeology-item-description">{item.description}</p>
                                </div>
                                 <button className="add-item-plan-btn" onClick={() => handleAddArchaeologyPlan(item)} aria-label={translations.add_plan_for_aria[language].replace('{title}', item.title)}>+</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});

const ThematicItem = React.memo(({ item, index, isExpanded, onToggle, onReferenceClick, onAddPlan }: { item: ThematicReadingItem, index: number, isExpanded: boolean, onToggle: (index: number) => void, onReferenceClick: (ref: string) => void, onAddPlan: (plan: ReadingPlan & { data?: any }) => void }) => {
    const { language } = useLanguage();
    
    const handleToggle = useCallback(() => {
        onToggle(index);
    }, [onToggle, index]);

    const handleAddClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const newPlan = {
            id: `theme_${item.theme.replace(/\s/g, '_').slice(0, 25)}`,
            title: item.theme,
            description: `Estudo sobre "${item.theme}"`,
            data: { references: item.references },
        };
        onAddPlan(newPlan);
    }, [item, onAddPlan]);
    
    return (
        <div className="thematic-item">
            <div className="thematic-item-header-wrapper">
                <button
                    className="thematic-item-header"
                    onClick={handleToggle}
                    aria-expanded={isExpanded}
                >
                    <span>{item.theme}</span>
                    <i className="material-icons">expand_more</i>
                </button>
                <button className="add-item-plan-btn" onClick={handleAddClick} aria-label={translations.add_plan_for_aria[language].replace('{title}', item.theme)}>+</button>
            </div>
            <div className={`thematic-item-references ${isExpanded ? 'expanded' : ''}`}>
                {item.references.map((ref, refIndex) => (
                    <button key={refIndex} className="thematic-reference-link" onClick={() => onReferenceClick(ref)}>
                        {ref}
                    </button>
                ))}
            </div>
        </div>
    );
});

const ThematicReadingView = React.memo(({ onBack, onAddPlan }: { onBack: () => void, onAddPlan: (plan: ReadingPlan & { data?: any }) => void; }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [reading, setReading] = useState<{ bookName: string, chapterNumber: number, chapterData: ChapterType } | null>(null);
    const { getBookContent, version } = useBible();
    const { showToast } = useToast();
    const { language } = useLanguage();

    const handleReferenceClick = useCallback(async (reference: string) => {
        const parsed = parseDetailedReference(reference, language);
        if (!parsed) {
            showToast(translations.reference_not_found_toast[language].replace('{reference}', reference));
            return;
        }
        const { book: canonicalBookName, chapter: chapterStr } = parsed;
        const chapter = parseInt(chapterStr, 10);
        const translatedBookName = getBookName(canonicalBookName, language);

        const bookData = await getBookContent(canonicalBookName, language, version);
        if (!bookData || !bookData.chapters[chapter - 1]) {
            showToast(translations.content_not_found_toast[language].replace('{book}', translatedBookName).replace('{chapter}', String(chapter)));
            return;
        }
        setReading({
            bookName: translatedBookName,
            chapterNumber: chapter,
            chapterData: bookData.chapters[chapter - 1],
        });
    }, [getBookContent, language, version, showToast]);

    const handleToggle = useCallback((index: number) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    }, []);
    
    const handleChapterChange = useCallback(async (newChapter: number) => {
        if (!reading) return;
        
        const { bookName } = reading;
        const canonicalBookName = getCanonicalName(bookName, language);
        if (!canonicalBookName) return;

        const bookData = await getBookContent(canonicalBookName, language, version);
        
        if (bookData && bookData.chapters[newChapter - 1]) {
            setReading({
                bookName,
                chapterNumber: newChapter,
                chapterData: bookData.chapters[newChapter - 1],
            });
            window.scrollTo(0, 0);
        }
    }, [reading, getBookContent, language, version]);

    if (reading) {
        const canonicalBookName = getCanonicalName(reading.bookName, language) || '';
        return <ReadingView 
                    bookName={reading.bookName} 
                    chapterNumber={reading.chapterNumber} 
                    chapterData={reading.chapterData} 
                    onBack={() => setReading(null)}
                    totalChapters={getChapterCount(canonicalBookName)}
                    onChapterChange={handleChapterChange}
                />
    }

    return (
        <div className="card">
            <BackButton onClick={onBack} text={translations.back[language]} />
            <h2>{translations.thematic_title[language]}</h2>
            <p>{translations.thematic_description[language]}</p>
            <div className="thematic-list">
                {thematicReadingData.map((item, index) => (
                     <ThematicItem
                        key={index}
                        item={item}
                        index={index}
                        isExpanded={expandedIndex === index}
                        onToggle={handleToggle}
                        onReferenceClick={handleReferenceClick}
                        onAddPlan={onAddPlan}
                    />
                ))}
            </div>
        </div>
    );
});

const PassageCard = React.memo(({ gospel, passage, onPassageClick }: { gospel: string; passage: string; onPassageClick: (gospel: string, passage: string) => void; }) => {
    const { language } = useLanguage();
    const gospelName = getGospelNameFromKey(gospel, language);
    
    const handleClick = useCallback(() => {
        if (passage) {
            onPassageClick(gospel, passage);
        }
    }, [gospel, passage, onPassageClick]);

    return (
        <div className={`passage-card gospel-${gospel}`}>
            <div className="passage-card__header">{gospelName}</div>
            <div className="passage-card__body">
                {passage ? (
                    <button className="passage-card__link" onClick={handleClick}>{passage}</button>
                ) : (
                    <span className="passage-card__empty">-</span>
                )}
            </div>
        </div>
    );
});

const HarmonyEvent = React.memo(({ item, onPassageClick }: { item: GospelHarmonyItem, onPassageClick: (gospel: string, passage: string) => void }) => {
    const { language } = useLanguage();
    return (
        <section className="harmony-event">
            <h3 className="harmony-event__title">{item.evento}</h3>
            <div className="harmony-event__passages">
                {Object.entries(item.passagens).map(([gospel, passage]) => (
                    <PassageCard key={gospel} gospel={gospel} passage={passage} onPassageClick={onPassageClick} />
                ))}
            </div>
            {item.observacoes &&
                <div className="harmony-event__notes">
                    <strong>{translations.harmony_notes[language]}:</strong> {item.observacoes}
                </div>
            }
        </section>
    );
});

const GospelHarmonyView = React.memo(({ onBack }: { onBack: () => void }) => {
    const [reading, setReading] = useState<{ bookName: string, chapterNumber: number, chapterData: ChapterType } | null>(null);
    const { getBookContent, version } = useBible();
    const { showToast } = useToast();
    const { language } = useLanguage();

    const handlePassageClick = useCallback(async (gospelKey: string, passage: string) => {
        if (!passage) return;

        const canonicalBookName = getGospelNameFromKey(gospelKey, 'en'); // Use canonical key for data fetching
        const translatedBookName = getGospelNameFromKey(gospelKey, language);
        if (!canonicalBookName) return;

        const cleanPassage = passage.replace(/\s*\(.*\)\s*/, '').trim();
        const chapterPart = cleanPassage.split(/[:\-]/)[0];
        const chapterNumber = parseInt(chapterPart, 10);
        
        if (isNaN(chapterNumber)) {
            console.error("Could not parse chapter from passage:", passage);
            return;
        }

        const bookData = await getBookContent(canonicalBookName, language, version);
        if (!bookData || !bookData.chapters[chapterNumber - 1]) {
            showToast(translations.content_not_found_toast[language].replace('{book}', translatedBookName).replace('{chapter}', String(chapterNumber)));
            return;
        }

        setReading({
            bookName: translatedBookName,
            chapterNumber,
            chapterData: bookData.chapters[chapterNumber - 1],
        });
    }, [getBookContent, language, version, showToast]);
    
    const handleChapterChange = useCallback(async (newChapter: number) => {
        if (!reading) return;
        
        const { bookName } = reading;
        const canonicalBookName = getCanonicalName(bookName, language);
        if (!canonicalBookName) return;
        
        const bookData = await getBookContent(canonicalBookName, language, version);
        
        if (bookData && bookData.chapters[newChapter - 1]) {
            setReading({
                bookName,
                chapterNumber: newChapter,
                chapterData: bookData.chapters[newChapter - 1],
            });
            window.scrollTo(0, 0);
        }
    }, [reading, getBookContent, language, version]);

    if (reading) {
        const canonicalBookName = getCanonicalName(reading.bookName, language) || '';
        return <ReadingView
            bookName={reading.bookName}
            chapterNumber={reading.chapterNumber}
            chapterData={reading.chapterData}
            onBack={() => setReading(null)}
            totalChapters={getChapterCount(canonicalBookName)}
            onChapterChange={handleChapterChange}
        />
    }

    return (
        <div className="card">
            <BackButton onClick={onBack} text={translations.back[language]} />
            <h2>{translations.harmony_title[language]}</h2>
            <p>{translations.harmony_description[language]}</p>
            <div className="harmony-list">
                {gospelHarmonyData.map((item, index) => (
                    <HarmonyEvent key={index} item={item} onPassageClick={handlePassageClick} />
                ))}
            </div>
        </div>
    );
});

const SearchResultsView = React.memo(({ results, query, onResultClick }: { results: SearchResult[], query: string, onResultClick: (result: SearchResult) => void }) => {
    const highlight = (text: string, query: string) => {
        if (!query) return text;
        const normalizedQuery = normalizeString(query);
        const parts = normalizeString(text).split(new RegExp(`(${normalizedQuery})`, 'gi'));
        let currentIndex = 0;
        return (
            <>
                {parts.map((part, index) => {
                    const originalPart = text.substring(currentIndex, currentIndex + part.length);
                    currentIndex += part.length;
                    if (normalizeString(part).toLowerCase() === normalizedQuery.toLowerCase()) {
                        return <strong key={index}>{originalPart}</strong>;
                    }
                    return originalPart;
                })}
            </>
        );
    };

    return (
        <div className="search-results-container">
            {results.map((result, index) => (
                <div key={index} className="search-result-item" onClick={() => onResultClick(result)} role="button" tabIndex={0}>
                    <div className="search-result-ref">{result.book} {result.chapter}:{result.verse}</div>
                    <p className="search-result-text">{highlight(result.text, query)}</p>
                </div>
            ))}
        </div>
    );
});

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
    const { getBookContent, version, loading: isBibleLoading } = useBible();
    const { language } = useLanguage();
    const { showToast } = useToast();
    const searchCache = useRef<Map<string, SearchResult[]>>(new Map());
    
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
                
                // The book name in bookmark could be in any language. Find its canonical name.
                const canonicalBookName = getCanonicalName(book, 'pt') || getCanonicalName(book, 'en') || getCanonicalName(book, 'es');
                if (!canonicalBookName) return;

                const translatedBookName = getBookName(canonicalBookName, language);
                const bookData = await getBookContent(canonicalBookName, language, version);

                if (bookData && bookData.chapters[chapter - 1]) {
                    setReading({
                        bookName: translatedBookName,
                        chapterNumber: chapter,
                        chapterData: bookData.chapters[chapter - 1],
                        verseToHighlight: verse
                    });
                }
                onVerseNavigated();
            }
        };
        navigateToVerse();
    }, [verseToNavigate, onVerseNavigated, getBookContent, language, version]);
    
    const goBackToIndex = useCallback(() => setView('index'), []);

    const performSearch = useCallback(async (query: string): Promise<SearchResult[]> => {
        const normalizedQuery = normalizeString(query);
        if (!normalizedQuery) return [];

        const parsedRef = parseDetailedReference(query, language);
        if (parsedRef) {
            const { book: canonicalBookName, chapter: chapterStr, verseStart: verseStr } = parsedRef;
            const chapter = parseInt(chapterStr, 10);
            const verse = verseStr ? parseInt(verseStr, 10) : null;
            const translatedBookName = getBookName(canonicalBookName, language);
            
            const bookData = await getBookContent(canonicalBookName, language, version);
            if (bookData && bookData.chapters[chapter - 1]) {
                if (verse && bookData.chapters[chapter - 1].verses[verse - 1]) {
                    return [{
                        book: translatedBookName, chapter, verse,
                        text: bookData.chapters[chapter - 1].verses[verse - 1].text
                    }];
                }
                return [];
            }
        }

        const results: SearchResult[] = [];
        const booksToSearch = getBookList('all_canon', language);
        for (const bookName of booksToSearch) {
            const canonicalBookName = getCanonicalName(bookName, language);
            if (!canonicalBookName) continue;
            
            const bookData = await getBookContent(canonicalBookName, language, version);
            if (bookData) {
                bookData.chapters.forEach((chap, chapIdx) => {
                    chap.verses.forEach(v => {
                        if (normalizeString(v.text).includes(normalizedQuery)) {
                            results.push({ book: bookName, chapter: chapIdx + 1, verse: v.verse, text: v.text });
                        }
                    });
                });
            }
        }
        return results;
    }, [getBookContent, language, version]);

    const debouncedSearch = useMemo(() => debounce(async (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        if (searchCache.current.has(trimmedQuery)) {
            setSearchResults(searchCache.current.get(trimmedQuery)!);
            setIsSearching(false);
            return;
        }
        
        setIsSearching(true);
        
        const parsedRef = parseDetailedReference(trimmedQuery, language);
        if (parsedRef && !parsedRef.verseStart) {
             const { book: canonicalBookName, chapter: chapterStr } = parsedRef;
             const chapter = parseInt(chapterStr, 10);
             const translatedBookName = getBookName(canonicalBookName, language);
             
             const bookData = await getBookContent(canonicalBookName, language, version);
             if (bookData && bookData.chapters[chapter - 1]) {
                 showToast(`Navegando para ${translatedBookName} ${chapter}...`);
                 setReading({
                     bookName: translatedBookName,
                     chapterNumber: chapter,
                     chapterData: bookData.chapters[chapter - 1],
                 });
                 setSearchQuery(''); 
                 setSearchResults([]);
                 setIsSearching(false);
                 return;
             }
        }
        
        const results = await performSearch(trimmedQuery);
        searchCache.current.set(trimmedQuery, results);
        setSearchResults(results);
        setIsSearching(false);
    }, 500), [getBookContent, language, version, performSearch, showToast]);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);
    
    const handleResultClick = useCallback(async (result: SearchResult) => {
        const canonicalBookName = getCanonicalName(result.book, language);
        if (!canonicalBookName) return;

        const bookData = await getBookContent(canonicalBookName, language, version);
        if (bookData && bookData.chapters[result.chapter - 1]) {
            setReading({
                bookName: result.book,
                chapterNumber: result.chapter,
                chapterData: bookData.chapters[result.chapter - 1],
                verseToHighlight: result.verse
            });
        }
    }, [getBookContent, language, version]);

    const handleChapterChange = useCallback(async (newChapter: number) => {
        if (!reading) return;
        
        const { bookName } = reading;
        const canonicalBookName = getCanonicalName(bookName, language);
        if (!canonicalBookName) return;
        
        const bookData = await getBookContent(canonicalBookName, language, version);
        
        if (bookData && bookData.chapters[newChapter - 1]) {
            setReading({
                bookName,
                chapterNumber: newChapter,
                chapterData: bookData.chapters[newChapter - 1],
            });
            window.scrollTo(0, 0);
        }
    }, [reading, getBookContent, language, version]);
    
    const setViewBible = useCallback(() => setView('bible'), []);
    const setViewGospelHarmony = useCallback(() => setView('gospelHarmony'), []);
    const setViewThemes = useCallback(() => setView('themes'), []);
    const setViewApocrypha = useCallback(() => setView('apocrypha'), []);
    const setViewArchaeology = useCallback(() => setView('archaeology'), []);

    const handleAddPlanClick = useCallback((plan: ReadingPlan) => {
        addPlan(plan);
    }, [addPlan]);

    const handleAddTraditionalPlan = useCallback(() => handleAddPlanClick(getReadingPlansData(language).find(p => p.id === 'anual_tradicional')!), [handleAddPlanClick, language]);
    const handleAddHarmonyPlan = useCallback(() => handleAddPlanClick(dynamicPlanDefinitions.gospelHarmony), [handleAddPlanClick]);
    const handleAddThemesPlan = useCallback(() => handleAddPlanClick(dynamicPlanDefinitions.themes), [handleAddPlanClick]);
    const handleAddApocryphaPlan = useCallback(() => handleAddPlanClick(dynamicPlanDefinitions.apocrypha), [handleAddPlanClick]);
    const handleAddArchaeologyPlan = useCallback(() => handleAddPlanClick(dynamicPlanDefinitions.archaeology), [handleAddPlanClick]);

    if (isBibleLoading) {
        return (
            <div className="card">
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
                <p style={{textAlign: 'center'}}>{translations.loading_bible[language]}</p>
            </div>
        );
    }
    
    if (reading) {
        const canonicalBookName = getCanonicalName(reading.bookName, language) || '';
        return <ReadingView 
                    bookName={reading.bookName} 
                    chapterNumber={reading.chapterNumber} 
                    chapterData={reading.chapterData} 
                    onBack={() => setReading(null)}
                    totalChapters={getChapterCount(canonicalBookName)}
                    onChapterChange={handleChapterChange}
                    verseToHighlight={reading.verseToHighlight}
                />
    }

    if (view === 'bible') return <BibleView onBack={goBackToIndex} onAddPlan={addPlan} />;
    if (view === 'apocrypha') return <Apocrypha onBack={goBackToIndex} onAddPlan={addPlan} />;
    if (view === 'archaeology') return <Archaeology onBack={goBackToIndex} onAddPlan={addPlan} />;
    if (view === 'themes') return <ThematicReadingView onBack={goBackToIndex} onAddPlan={addPlan} />;
    if (view === 'gospelHarmony') return <GospelHarmonyView onBack={goBackToIndex} />;

    return (
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
                <SearchResultsView results={searchResults} query={searchQuery} onResultClick={handleResultClick} />
            )}
            
            {!isSearching && searchQuery && searchResults.length === 0 && (
                <div className="search-empty">
                    <p>{translations.search_no_results[language]} "{searchQuery}".</p>
                </div>
            )}
            
            {!searchQuery && (
                <div className="directory-grid">
                    <div className="directory-item-wrapper">
                        <button onClick={setViewBible}>{translations.dir_read_bible[language]}</button>
                        <button className="add-plan-from-dir-btn" onClick={handleAddTraditionalPlan} aria-label={translations.add_plan_for_aria[language].replace('{title}', translations.rp_anual_tradicional_title[language])}>+</button>
                    </div>
                    <div className="directory-item-wrapper">
                        <button onClick={setViewGospelHarmony}>{translations.dir_gospel_harmony[language]}</button>
                        <button className="add-plan-from-dir-btn" onClick={handleAddHarmonyPlan} aria-label={translations.add_plan_for_aria[language].replace('{title}', translations.dir_gospel_harmony[language])}>+</button>
                    </div>
                    <div className="directory-item-wrapper">
                        <button onClick={setViewThemes}>{translations.dir_thematic[language]}</button>
                        <button className="add-plan-from-dir-btn" onClick={handleAddThemesPlan} aria-label={translations.add_plan_for_aria[language].replace('{title}', translations.dir_thematic[language])}>+</button>
                    </div>
                    <div className="directory-item-wrapper">
                        <button onClick={setViewApocrypha}>{translations.dir_apocrypha[language]}</button>
                        <button className="add-plan-from-dir-btn" onClick={handleAddApocryphaPlan} aria-label={translations.add_plan_for_aria[language].replace('{title}', translations.dir_apocrypha[language])}>+</button>
                    </div>
                    <div className="directory-item-wrapper">
                        <button onClick={setViewArchaeology}>{translations.dir_archaeology[language]}</button>
                        <button className="add-plan-from-dir-btn" onClick={handleAddArchaeologyPlan} aria-label={translations.add_plan_for_aria[language].replace('{title}', translations.dir_archaeology[language])}>+</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BibleDirectory;