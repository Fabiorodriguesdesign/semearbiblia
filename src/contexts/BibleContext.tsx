import React, { useState, createContext, useContext, useMemo, useCallback, useRef } from 'react';
import { ChapterType, VerseType } from '../types';
import { useLanguage } from './LanguageContext';

type BibleContextType = {
    loading: boolean;
    version: string;
    getChapterContent: (canonicalBookName: string, chapterNumber: number) => Promise<ChapterType | undefined>;
};
const BibleContext = createContext<BibleContextType | null>(null);

export const useBible = () => {
    const context = useContext(BibleContext);
    if (!context) throw new Error('useBible must be used within a BibleProvider');
    return context;
};

export const BibleProvider = React.memo(({ children }: React.PropsWithChildren<{}>) => {
    const [loading, setLoading] = useState(false);
    const { language } = useLanguage();
    const version = useMemo(() => {
        switch (language) {
            case 'pt': return 'kjv_pt';
            case 'en': return 'kjv_en'; 
            case 'es': return 'rvr_es';
            default: return 'kjv_pt';
        }
    }, [language]);
    const chapterCache = useRef<Map<string, ChapterType>>(new Map());
    const fallbackBibleData = useRef<any>(null); // Cache for the fallback JSON

    const getChapterContent = useCallback(async (canonicalBookName: string, chapterNumber: number): Promise<ChapterType | undefined> => {
        const cacheKey = `${version}_${canonicalBookName}_${chapterNumber}`;
        if (chapterCache.current.has(cacheKey)) {
            return chapterCache.current.get(cacheKey);
        }

        setLoading(true);
        try {
            // This is the new on-demand fetching from a hypothetical backend.
            // The text files should be structured with one verse per line: "1 Text of verse one."
            const response = await fetch(`/bible-text/${version}/${canonicalBookName}/${chapterNumber}.txt`);
            
            if (!response.ok) {
                console.warn(`Could not fetch ${response.url}. Falling back to JSON data.`);
                
                let bibleData = fallbackBibleData.current;
                if (!bibleData) {
                    console.log('Fetching and caching fallback Bible JSON...');
                    const jsonResponse = await fetch('/biblia_kjv_final.json');
                    if(!jsonResponse.ok) throw new Error('Fallback JSON not found');
                    bibleData = await jsonResponse.json();
                    fallbackBibleData.current = bibleData; // Cache the fetched data
                }

                const bookDataFromJSON = bibleData[language]?.[version]?.[canonicalBookName];
                if (!bookDataFromJSON || !bookDataFromJSON[chapterNumber]) {
                     throw new Error(`Chapter ${chapterNumber} not found for ${canonicalBookName} in fallback JSON.`);
                }

                const versesFromJSON: VerseType[] = Object.keys(bookDataFromJSON[chapterNumber]).map(verseNum => ({
                    verse: parseInt(verseNum),
                    text: bookDataFromJSON[chapterNumber][verseNum]
                }));

                const chapterDataFromJSON: ChapterType = { verses: versesFromJSON };
                chapterCache.current.set(cacheKey, chapterDataFromJSON);
                return chapterDataFromJSON;
            }

            const text = await response.text();
            const verses: VerseType[] = text.split('\n')
                .filter(line => line.trim() !== '')
                .map(line => {
                    const firstSpaceIndex = line.indexOf(' ');
                    if (firstSpaceIndex === -1) return { verse: 0, text: line }; // Handle potential malformed lines
                    const verseNum = parseInt(line.substring(0, firstSpaceIndex), 10);
                    const verseText = line.substring(firstSpaceIndex + 1);
                    return { verse: verseNum, text: verseText };
                })
                .filter(v => !isNaN(v.verse) && v.verse > 0);

            const chapterData: ChapterType = { verses };
            chapterCache.current.set(cacheKey, chapterData);
            return chapterData;
        } catch (error) {
            console.error("Error fetching chapter content:", error);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [version, language]);

    const value = useMemo(() => ({
        loading, version, getChapterContent
    }), [loading, version, getChapterContent]);
    
    return <BibleContext.Provider value={value}>{children}</BibleContext.Provider>;
});