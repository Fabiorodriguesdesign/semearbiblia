import { getCanonicalName } from '../data/bibleBooks';
import { Language } from '../types';

export const parseDetailedReference = (ref: string, lang: Language): { book: string; chapter: string; verseStart: string; verseEnd: string; } | null => {
    if (ref.includes('toda a carta')) return null;

    const cleanedRef = ref.trim().toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/ a /g, '-');
        
    const match = cleanedRef.match(/^((\d\s)?[\wà-ú\s]+?)\.?\s(\d+)(?:[:.,](\d+(?:-\d+)?))?(?:,\s*(\d+))?$/);
    if (!match) {
        console.warn("Could not parse detailed reference:", ref);
        return null;
    }

    const [, bookQuery, , chapter, versePart] = match;
    const canonicalName = getCanonicalName(bookQuery.trim(), lang);
    
    if (!canonicalName) {
        console.warn("Unknown book abbreviation in detailed reference:", bookQuery);
        return null;
    }

    let verseStart = '1', verseEnd = '';
    if (versePart) {
        const verseRange = versePart.split('-');
        verseStart = verseRange[0];
        verseEnd = verseRange[1] || '';
    }

    return { book: canonicalName, chapter: chapter || '1', verseStart, verseEnd };
};
