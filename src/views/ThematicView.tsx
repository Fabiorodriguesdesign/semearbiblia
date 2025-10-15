import React, { useState, useCallback } from 'react';
import { ReadingPlan, ThematicReadingItem, ChapterType } from '../types';
import { useBible } from '../contexts/BibleContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { getBookName, getChapterCount, getCanonicalName } from '../data/bibleBooks';
import { thematicReadingData } from '../data/thematicData';
import { parseDetailedReference } from '../utils/verseParser';
import { translations } from '../data/translations';
import BackButton from '../components/common/BackButton';
import ReadingView from '../components/bible/ReadingView';

const ThematicItem = React.memo(({ item, index, isExpanded, onToggle, onReferenceClick, onAddPlan }: { item: ThematicReadingItem, index: number, isExpanded: boolean, onToggle: (index: number) => void, onReferenceClick: (ref: string) => void, onAddPlan: (plan: ReadingPlan & { data?: any }) => void }) => {
    const { language } = useLanguage();
    
    const handleToggle = useCallback(() => {
        onToggle(index);
    }, [onToggle, index]);

    const handleAddClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const newPlan = {
            id: `theme_${item.theme.replace(/\s/g, '_').slice(0, 25)}`,
            title: item.theme,
            description: `Estudo sobre "${item.theme}"`,
            data: { references: item.references },
        };
        onAddPlan(newPlan);
    }, [item, onAddPlan]);
    
    return (
        <div className="thematic-item">
            <div className="thematic-item-header-wrapper">
                <button
                    className="thematic-item-header"
                    onClick={handleToggle}
                    aria-expanded={isExpanded}
                >
                    <span>{item.theme}</span>
                    <i className="material-icons">expand_more</i>
                </button>
                <button className="add-item-plan-btn" onClick={handleAddClick} aria-label={translations.add_plan_for_aria[language].replace('{title}', item.theme)}>+</button>
            </div>
            <div className={`thematic-item-references ${isExpanded ? 'expanded' : ''}`}>
                {item.references.map((ref, refIndex) => (
                    <button key={refIndex} className="thematic-reference-link" onClick={() => onReferenceClick(ref)}>
                        {ref}
                    </button>
                ))}
            </div>
        </div>
    );
});

const ThematicView = ({ onBack, onAddPlan }: { onBack: () => void, onAddPlan: (plan: ReadingPlan & { data?: any }) => void; }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [reading, setReading] = useState<{ bookName: string, chapterNumber: number, chapterData: ChapterType } | null>(null);
    const { getChapterContent } = useBible();
    const { showToast } = useToast();
    const { language } = useLanguage();

    const handleReferenceClick = useCallback(async (reference: string) => {
        const parsed = parseDetailedReference(reference, language);
        if (!parsed) {
            showToast(translations.reference_not_found_toast[language].replace('{reference}', reference));
            return;
        }
        const { book: canonicalBookName, chapter: chapterStr } = parsed;
        const chapter = parseInt(chapterStr, 10);
        const translatedBookName = getBookName(canonicalBookName, language);

        const chapterData = await getChapterContent(canonicalBookName, chapter);
        if (!chapterData) {
            showToast(translations.content_not_found_toast[language].replace('{book}', translatedBookName).replace('{chapter}', String(chapter)));
            return;
        }
        setReading({
            bookName: translatedBookName,
            chapterNumber: chapter,
            chapterData: chapterData,
        });
    }, [getChapterContent, language, showToast]);

    const handleToggle = useCallback((index: number) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    }, []);
    
    const handleChapterChange = useCallback(async (newChapter: number) => {
        if (!reading) return;
        
        const { bookName } = reading;
        const canonicalBookName = getCanonicalName(bookName, language);
        if (!canonicalBookName) return;

        const chapterData = await getChapterContent(canonicalBookName, newChapter);
        
        if (chapterData) {
            setReading({
                bookName,
                chapterNumber: newChapter,
                chapterData: chapterData,
            });
            window.scrollTo(0, 0);
        }
    }, [reading, getChapterContent, language]);

    if (reading) {
        const canonicalBookName = getCanonicalName(reading.bookName, language) || '';
        return <ReadingView 
                    bookName={reading.bookName} 
                    chapterNumber={reading.chapterNumber} 
                    chapterData={reading.chapterData} 
                    onBack={() => setReading(null)}
                    totalChapters={getChapterCount(canonicalBookName)}
                    onChapterChange={handleChapterChange}
                />
    }

    return (
        <div className="card">
            <BackButton onClick={onBack} text={translations.back[language]} />
            <h2>{translations.thematic_title[language]}</h2>
            <p>{translations.thematic_description[language]}</p>
            <div className="thematic-list">
                {thematicReadingData.map((item, index) => (
                     <ThematicItem
                        key={index}
                        item={item}
                        index={index}
                        isExpanded={expandedIndex === index}
                        onToggle={handleToggle}
                        onReferenceClick={handleReferenceClick}
                        onAddPlan={onAddPlan}
                    />
                ))}
            </div>
        </div>
    );
};

export default ThematicView;
