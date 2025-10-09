import React, { useCallback } from 'react';
import { ReadingPlan } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import { getCanonicalName } from '../../data/bibleBooks';

const MemoBookItem = React.memo(({ book, onBookClick, onAddPlan }: { book: string, onBookClick: (book: string) => void, onAddPlan: (plan: ReadingPlan) => void }) => {
    const { language } = useLanguage();

    const handleAddClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const canonicalName = getCanonicalName(book, language);
        if (!canonicalName) return;

        const title = translations.reading_plan_for_book_title[language].replace('{book}', book);
        const description = translations.reading_plan_for_book_desc[language].replace('{book}', book);
        const newPlan: ReadingPlan = {
            id: `book_${canonicalName.replace(/\s/g, '_')}`,
            title: title,
            description: description,
        };
        onAddPlan(newPlan);
    }, [book, onAddPlan, language]);

    return (
        <div className="book-card">
            <button className="book-card-name" onClick={() => onBookClick(book)}>{book}</button>
            <button 
                className="book-card-add-btn" 
                onClick={handleAddClick} 
                aria-label={translations.add_plan_for_aria[language].replace('{title}', book)}
            >
                <i className="material-icons">add</i>
            </button>
        </div>
    );
});

const BookGrid = React.memo(({ books, onBookClick, onAddPlan }: { books: string[], onBookClick: (book: string) => void, onAddPlan: (plan: ReadingPlan) => void }) => (
    <div className="book-grid">{books.map(book => <MemoBookItem key={book} book={book} onBookClick={onBookClick} onAddPlan={onAddPlan} />)}</div>
));

export default BookGrid;
