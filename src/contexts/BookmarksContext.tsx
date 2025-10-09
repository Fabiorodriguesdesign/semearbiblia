import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { Bookmark } from '../types';
import { debounce } from '../utils/utils';

type BookmarksContextType = {
    bookmarks: Bookmark[];
    addBookmark: (bookmark: Bookmark) => void;
    removeBookmark: (book: string, chapter: number, verse: number) => void;
    isBookmarked: (book: string, chapter: number, verse: number) => boolean;
};
const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const useBookmarks = () => {
    const context = useContext(BookmarksContext);
    if (!context) throw new Error('useBookmarks must be used within a BookmarksProvider');
    return context;
};

export const BookmarksProvider = React.memo(({ children }: React.PropsWithChildren<{}>) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

    useEffect(() => {
        try {
            const storedBookmarks = localStorage.getItem('semear_bookmarks');
            if (storedBookmarks) {
                setBookmarks(JSON.parse(storedBookmarks));
            }
        } catch (error) {
            console.error("Failed to load bookmarks from localStorage", error);
            setBookmarks([]);
        }
    }, []);

    const debouncedSaveBookmarks = useMemo(
        () => debounce((bkms: Bookmark[]) => {
            try {
                localStorage.setItem('semear_bookmarks', JSON.stringify(bkms));
            } catch (error) {
                console.error("Failed to save bookmarks to localStorage", error);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSaveBookmarks(bookmarks);
    }, [bookmarks, debouncedSaveBookmarks]);
    
    const isBookmarked = useCallback((book: string, chapter: number, verse: number) => {
        return bookmarks.some(b => b.book === book && b.chapter === chapter && b.verse === verse);
    }, [bookmarks]);

    const addBookmark = useCallback((bookmark: Bookmark) => {
        setBookmarks(prev => {
            if (isBookmarked(bookmark.book, bookmark.chapter, bookmark.verse)) {
                return prev;
            }
            return [bookmark, ...prev].sort((a, b) => a.book.localeCompare(b.book) || a.chapter - b.chapter || a.verse - b.verse);
        });
    }, [isBookmarked]);

    const removeBookmark = useCallback((book: string, chapter: number, verse: number) => {
        setBookmarks(prev => prev.filter(b => !(b.book === book && b.chapter === chapter && b.verse === verse)));
    }, []);
    
    const value = useMemo(() => ({
        bookmarks, addBookmark, removeBookmark, isBookmarked
    }), [bookmarks, addBookmark, removeBookmark, isBookmarked]);

    return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
});