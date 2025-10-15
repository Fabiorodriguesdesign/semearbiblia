import React, { useMemo } from 'react';
import { ReadingPlan } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { getBookList } from '../data/bibleBooks';
import BibleBookView from '../components/bible/BibleBookView';

const ApocryphaView = ({ onBack, onAddPlan }: { onBack: () => void, onAddPlan: (plan: ReadingPlan) => void; }) => {
    const { language } = useLanguage();
    const bookSections = useMemo(() => [{ title: translations.selected_texts[language], books: getBookList('ap', language) }], [language]);

    return (
        <BibleBookView
            onBack={onBack}
            onAddPlan={onAddPlan}
            title={translations.apocrypha_title[language]}
            description={translations.apocrypha_description[language]}
            bookSections={bookSections}
        />
    );
};

export default ApocryphaView;