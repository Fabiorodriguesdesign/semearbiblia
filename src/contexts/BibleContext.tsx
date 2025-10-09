import React, { useState, useEffect, createContext, useContext, useMemo, useCallback, useRef } from 'react';
import { BookDataType, ChapterType, Language } from '../types';
import { useLanguage } from './LanguageContext';

type BibleDataContent = any; 
type BibleContextType = {
    bibleData: BibleDataContent | null;
    loading: boolean;
    version: string;
    getBookContent: (canonicalBookName: string, lang: Language, ver: string) => Promise<BookDataType | undefined>;
};
const BibleContext = createContext<BibleContextType | null>(null);
export const useBible = () => {
    const context = useContext(BibleContext);
    if (!context) throw new Error('useBible deve ser usado dentro de um BibleProvider');
    return context;
};

export const BibleProvider = React.memo(({ children }: React.PropsWithChildren<{}>) => {
    const [bibleData, setBibleData] = useState<BibleDataContent | null>(null);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const version = useMemo(() => {
        switch (language) {
            case 'pt': return 'kjv_pt';
            case 'en': return 'kjv_en'; 
            case 'es': return 'rvr_es';
            default: return 'kjv_pt';
        }
    }, [language]);
    const bookCache = useRef<Map<string, BookDataType>>(new Map());

    useEffect(() => {
        fetch('/biblia_kjv_final.json')
            .then(res => res.ok ? res.json() : {})
            .then(data => setBibleData(data))
            .catch(err => {
                console.error("Error loading Bible JSON:", err);
                setBibleData({});
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    
    const getBookContent = useCallback(async (canonicalBookName: string, lang: Language, ver: string): Promise<BookDataType | undefined> => {
        const cacheKey = `${lang}_${ver}_${canonicalBookName}`;
        if (bookCache.current.has(cacheKey)) {
            return bookCache.current.get(cacheKey);
        }

        if (bibleData === null) return undefined;
        // The JSON data uses canonical (English) book names as keys.
        const bookDataFromJSON = bibleData[lang]?.[ver]?.[canonicalBookName];
        
        if (!bookDataFromJSON) {
            console.warn(`Data not found for ${canonicalBookName} in ${lang}/${ver}.`);
            return undefined;
        }

        const chaptersArray: ChapterType[] = Object.keys(bookDataFromJSON).map(chapterNum => ({
            verses: Object.keys(bookDataFromJSON[chapterNum]).map(verseNum => ({
                verse: parseInt(verseNum),
                text: bookDataFromJSON[chapterNum][verseNum]
            }))
        }));
        
        const processedBook = { chapters: chaptersArray };
        bookCache.current.set(cacheKey, processedBook);
        return processedBook;
    }, [bibleData]);

    const value = useMemo(() => ({
        bibleData, loading, version, getBookContent
    }), [bibleData, loading, version, getBookContent]);
    
    return <BibleContext.Provider value={value}>{children}</BibleContext.Provider>;
});