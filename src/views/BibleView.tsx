import React, { useMemo } from 'react';
import { ReadingPlan } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { getBookList } from '../data/bibleBooks';
import BibleBookView from '../components/bible/BibleBookView';

const BibleView = ({ onBack, onAddPlan }: { onBack: () => void, onAddPlan: (plan: ReadingPlan) => void; }) => {
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
};

export default BibleView;