import React, { useState, useCallback } from 'react';
import { ChapterType, ReadingPlan } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useBible } from '../../contexts/BibleContext';
import { useToast } from '../../contexts/ToastContext';
import { translations } from '../../data/translations';
import { getCanonicalName, getChapterCount } from '../../data/bibleBooks';
import BackButton from '../common/BackButton';
import BookGrid from '../common/BookGrid';
import ReadingView from './ReadingView';
import ChapterSelectionView from './ChapterSelectionView';

const BibleBookView = React.memo(({ title, description, bookSections, onBack, onAddPlan }: { title: string, description: string, bookSections: any[], onBack: (() => void) | undefined, onAddPlan: (plan: ReadingPlan) => void }) => {
    const [selectedBook, setSelectedBook] = useState<string | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [loadedChapterData, setLoadedChapterData] = useState<ChapterType | null>(null);
    const [isChapterLoading, setIsChapterLoading] = useState(false);
    
    const { showToast } = useToast();
    const { language } = useLanguage();
    const { getChapterContent } = useBible(); 

    const handleSelectBook = useCallback((bookName: string) => {
        setSelectedBook(bookName);
    }, []);

    const handleSelectChapter = useCallback(async (chapterNum: number) => {
        if (!selectedBook) return;

        setIsChapterLoading(true);
        setLoadedChapterData(null);
        
        const canonicalBookName = getCanonicalName(selectedBook, language);
        if (!canonicalBookName) {
            showToast(translations.content_not_available_toast[language].replace('{bookName}', selectedBook));
            setIsChapterLoading(false);
            return;
        }

        const data = await getChapterContent(canonicalBookName, chapterNum); 
        
        if (data && data.verses.length > 0) {
            setSelectedChapter(chapterNum);
            setLoadedChapterData(data);
        } else {
            showToast(translations.content_not_found_toast[language].replace('{book}', selectedBook).replace('{chapter}', String(chapterNum)));
        }
        setIsChapterLoading(false);
    }, [getChapterContent, language, showToast, selectedBook]);

    const handleChapterChange = useCallback((newChapter: number) => {
        handleSelectChapter(newChapter);
        window.scrollTo(0, 0);
    }, [handleSelectChapter]);

    const handleBackToChapters = useCallback(() => {
        setSelectedChapter(null);
        setLoadedChapterData(null);
    }, []);

    const handleBackToBooks = useCallback(() => {
      setSelectedBook(null);
      setSelectedChapter(null);
      setLoadedChapterData(null);
    }, []);

    if (isChapterLoading) {
        return (
            <div className="card">
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
                <p style={{textAlign: 'center'}}>{translations.loading_book_content[language]}</p>
            </div>
        );
    }

    if (selectedBook && selectedChapter && loadedChapterData) {
        const canonicalBookName = getCanonicalName(selectedBook, language) || '';
        return (
            <ReadingView 
                bookName={selectedBook} 
                chapterNumber={selectedChapter} 
                chapterData={loadedChapterData} 
                onBack={handleBackToChapters}
                totalChapters={getChapterCount(canonicalBookName)}
                onChapterChange={handleChapterChange}
            />
        );
    }

    if (selectedBook) {
        const canonicalBookName = getCanonicalName(selectedBook, language) || '';
        const totalChapters = getChapterCount(canonicalBookName);
        return <ChapterSelectionView bookName={selectedBook} totalChapters={totalChapters} onChapterSelect={handleSelectChapter} onBack={handleBackToBooks} />;
    }

    return (
        <div className="card">
            {onBack && <BackButton onClick={onBack} text={translations.back[language]} />}
            <h2>{title}</h2>
            <p>{description}</p>
            {bookSections.map((section: any) => (
                <div key={section.title} className={section.className || ''}>
                    <h3 className="book-section-title">{section.title}</h3>
                    <BookGrid books={section.books} onBookClick={handleSelectBook} onAddPlan={onAddPlan} />
                </div>
            ))}
        </div>
    );
});

export default BibleBookView;