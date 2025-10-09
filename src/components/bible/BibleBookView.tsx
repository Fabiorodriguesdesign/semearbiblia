import React, { useState, useCallback } from 'react';
import { BookDataType, ReadingPlan } from '../../types';
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
    const [loading, setLoading] = useState(false);
    const [loadedBookData, setLoadedBookData] = useState<BookDataType | null>(null);
    const { showToast } = useToast();
    const { language } = useLanguage();
    
    const { getBookContent, version } = useBible(); 

    const handleSelectBook = useCallback(async (bookName: string) => {
        if (!bookName) return;
        setLoading(true);
        setLoadedBookData(null);
        
        const canonicalBookName = getCanonicalName(bookName, language);
        if (!canonicalBookName) {
            showToast(translations.content_not_available_toast[language].replace('{bookName}', bookName));
            setLoading(false);
            return;
        }

        const data = await getBookContent(canonicalBookName, language, version); 
        
        if (data && data.chapters.length > 0) {
            setSelectedBook(bookName);
            setLoadedBookData(data);
        } else {
            showToast(translations.content_not_available_toast[language].replace('{bookName}', bookName));
        }
        setLoading(false);
    }, [getBookContent, language, version, showToast]);

    const handleSelectChapter = useCallback((chapterNum: number) => setSelectedChapter(chapterNum), []);
    
    const handleChapterChange = useCallback((newChapter: number) => {
        setSelectedChapter(newChapter);
        window.scrollTo(0, 0);
    }, []);

    const handleBackToChapters = useCallback(() => setSelectedChapter(null), []);
    const handleBackToBooks = useCallback(() => {
      setSelectedBook(null);
      setSelectedChapter(null);
      setLoadedBookData(null);
    }, []);

    if (loading) return <div className="card"><h2>{translations.loading[language]}</h2><p>{translations.loading_book_content[language]}</p></div>;

    if (selectedBook && selectedChapter && loadedBookData) {
        const chapterData = loadedBookData.chapters[selectedChapter - 1];
        const canonicalBookName = getCanonicalName(selectedBook, language) || '';
        return (
            <ReadingView 
                bookName={selectedBook} 
                chapterNumber={selectedChapter} 
                chapterData={chapterData} 
                onBack={handleBackToChapters}
                totalChapters={getChapterCount(canonicalBookName)}
                onChapterChange={handleChapterChange}
            />
        );
    }

    if (selectedBook && loadedBookData) {
        return <ChapterSelectionView bookName={selectedBook} bookData={loadedBookData} onChapterSelect={handleSelectChapter} onBack={handleBackToBooks} />;
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
