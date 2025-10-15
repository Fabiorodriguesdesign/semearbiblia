export type Theme = 'light' | 'dark';
export type Language = 'pt' | 'en' | 'es';
export type Tab = 'home' | 'bible' | 'plans' | 'notes' | 'chat';
export type DrawerPage = 'bookmarks' | 'settings' | null;

export type VerseType = { verse: number; text: string; };
export type ChapterType = { verses: VerseType[]; };
export type BookDataType = { chapters: ChapterType[]; };
export type ReadingPlan = { id: string; title: string; description: string; audience?: string; benefit?: string; };
export type MyReadingPlan = ReadingPlan & { 
    progress: { [key: string]: boolean }; 
    data?: any; 
    notes?: { [key: string]: string; };
};

export type NoteReference = { date: string; book: string; chapter: string; verseStart: string; verseEnd: string; };
export type NoteType = { id: number; planTitle: string; title: string; references: NoteReference[]; content: string; tags: string; createdAt: string; };
export type SearchResult = { book: string; chapter: number; verse: number; text: string; };
export type Bookmark = { book: string; chapter: number; verse: number; text: string; };

// Tipos para dados estáticos
export type ThematicReadingItem = { theme: string; references: string[]; };
export type GospelHarmonyItem = { evento: string; passagens: { [key: string]: string }; observacoes: string; };

export type ArchaeologyItem = {
    title: string;
    description: string;
};

export type ArchaeologyCategory = {
    category: string;
    items: ArchaeologyItem[];
};

export type VerseOfTheDay = {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    reflection: string;
};