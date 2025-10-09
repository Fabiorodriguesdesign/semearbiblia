import React, { useCallback, useRef, useEffect } from 'react';
import { ChapterType, VerseType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useBookmarks } from '../../contexts/BookmarksContext';
import { useToast } from '../../contexts/ToastContext';
import { translations } from '../../data/translations';
import BackButton from '../common/BackButton';

interface ReadingViewProps {
    bookName: string;
    chapterNumber: number;
    chapterData: ChapterType;
    onBack: () => void;
    totalChapters: number;
    onChapterChange: (newChapter: number) => void;
    verseToHighlight?: number;
}

const VerseItem = React.memo(({ verseData, bookName, chapterNumber }: { verseData: VerseType, bookName: string, chapterNumber: number }) => {
    const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
    const { showToast } = useToast();
    const { language } = useLanguage();

    const bookmarked = isBookmarked(bookName, chapterNumber, verseData.verse);

    const handleToggleBookmark = useCallback(() => {
        if (bookmarked) {
            removeBookmark(bookName, chapterNumber, verseData.verse);
            showToast(translations.bookmark_removed[language]);
        } else {
            addBookmark({
                book: bookName,
                chapter: chapterNumber,
                verse: verseData.verse,
                text: verseData.text,
            });
            showToast(translations.bookmark_added[language]);
        }
    }, [bookmarked, bookName, chapterNumber, verseData, addBookmark, removeBookmark, showToast, language]);

    return (
        <p className="verse-item" id={`verse-${verseData.verse}`}>
            <button className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`} onClick={handleToggleBookmark}>
                <i className="material-icons">{bookmarked ? 'bookmark' : 'bookmark_border'}</i>
            </button>
            <sup className="verse-number">{verseData.verse}</sup>
            <span className="verse-text">{verseData.text}</span>
        </p>
    );
});

const ReadingView = React.memo(({ bookName, chapterNumber, chapterData, onBack, totalChapters, onChapterChange, verseToHighlight }: ReadingViewProps) => {
    const { language } = useLanguage();
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    useEffect(() => {
        if (verseToHighlight) {
            setTimeout(() => {
                const element = document.getElementById(`verse-${verseToHighlight}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100); // Small delay to ensure DOM is ready
        }
    }, [verseToHighlight, bookName, chapterNumber]);

    const handlePrevChapter = useCallback(() => {
        if (chapterNumber > 1) {
            onChapterChange(chapterNumber - 1);
        }
    }, [chapterNumber, onChapterChange]);

    const handleNextChapter = useCallback(() => {
        if (chapterNumber < totalChapters) {
            onChapterChange(chapterNumber + 1);
        }
    }, [chapterNumber, totalChapters, onChapterChange]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const swipeDistanceX = touchEndX - touchStartX.current;
        const swipeDistanceY = touchEndY - touchStartY.current;

        if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && Math.abs(swipeDistanceX) > 50) {
            if (swipeDistanceX > 0) {
                handlePrevChapter();
            } else {
                handleNextChapter();
            }
        }
        
        touchStartX.current = null;
        touchStartY.current = null;
    }, [handlePrevChapter, handleNextChapter]);

    return (
        <div 
            className="card reading-view"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <BackButton onClick={onBack} text={translations.back[language]} />
            <h2>{bookName} {chapterNumber}</h2>
            <div className="verse-list">
                {chapterData.verses.map((v: VerseType) => (
                    <VerseItem key={v.verse} verseData={v} bookName={bookName} chapterNumber={chapterNumber} />
                ))}
            </div>
            <div className="reading-nav">
                <button className="reading-nav-btn" onClick={handlePrevChapter} disabled={chapterNumber <= 1}>
                    <i className="material-icons">chevron_left</i>
                    <span>{translations.chapter_previous[language]}</span>
                </button>
                <span className="reading-nav-current">{bookName} {chapterNumber}</span>
                <button className="reading-nav-btn" onClick={handleNextChapter} disabled={chapterNumber >= totalChapters}>
                    <span>{translations.chapter_next[language]}</span>
                    <i className="material-icons">chevron_right</i>
                </button>
            </div>
        </div>
    );
});

export default ReadingView;