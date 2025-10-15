import React, { useState, useCallback } from 'react';
import { GospelHarmonyItem, ChapterType } from '../types';
import { useBible } from '../contexts/BibleContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { getBookName, getChapterCount, getCanonicalName, getGospelNameFromKey } from '../data/bibleBooks';
import { gospelHarmonyData } from '../data/harmonyData';
import { translations } from '../data/translations';
import BackButton from '../components/common/BackButton';
import ReadingView from '../components/bible/ReadingView';

const PassageCard = React.memo(({ gospel, passage, onPassageClick }: { gospel: string; passage: string; onPassageClick: (gospel: string, passage: string) => void; }) => {
    const { language } = useLanguage();
    const gospelName = getGospelNameFromKey(gospel, language);
    
    const handleClick = useCallback(() => {
        if (passage) {
            onPassageClick(gospel, passage);
        }
    }, [gospel, passage, onPassageClick]);

    return (
        <div className={`passage-card gospel-${gospel}`}>
            <div className="passage-card__header">{gospelName}</div>
            <div className="passage-card__body">
                {passage ? (
                    <button className="passage-card__link" onClick={handleClick}>{passage}</button>
                ) : (
                    <span className="passage-card__empty">-</span>
                )}
            </div>
        </div>
    );
});

const HarmonyEvent = React.memo(({ item, onPassageClick }: { item: GospelHarmonyItem, onPassageClick: (gospel: string, passage: string) => void }) => {
    const { language } = useLanguage();
    return (
        <section className="harmony-event">
            <h3 className="harmony-event__title">{item.evento}</h3>
            <div className="harmony-event__passages">
                {Object.entries(item.passagens).map(([gospel, passage]) => (
                    <PassageCard key={gospel} gospel={gospel} passage={passage} onPassageClick={onPassageClick} />
                ))}
            </div>
            {item.observacoes &&
                <div className="harmony-event__notes">
                    <strong>{translations.harmony_notes[language]}:</strong> {item.observacoes}
                </div>
            }
        </section>
    );
});

const HarmonyView = ({ onBack }: { onBack: () => void }) => {
    const [reading, setReading] = useState<{ bookName: string, chapterNumber: number, chapterData: ChapterType } | null>(null);
    const { getChapterContent } = useBible();
    const { showToast } = useToast();
    const { language } = useLanguage();

    const handlePassageClick = useCallback(async (gospelKey: string, passage: string) => {
        if (!passage) return;

        const canonicalBookName = getGospelNameFromKey(gospelKey, 'en'); // Use canonical key for data fetching
        const translatedBookName = getGospelNameFromKey(gospelKey, language);
        if (!canonicalBookName) return;

        const cleanPassage = passage.replace(/\s*\(.*\)\s*/, '').trim();
        const chapterPart = cleanPassage.split(/[:\-]/)[0];
        const chapterNumber = parseInt(chapterPart, 10);
        
        if (isNaN(chapterNumber)) {
            console.error("Could not parse chapter from passage:", passage);
            return;
        }

        const chapterData = await getChapterContent(canonicalBookName, chapterNumber);
        if (!chapterData) {
            showToast(translations.content_not_found_toast[language].replace('{book}', translatedBookName).replace('{chapter}', String(chapterNumber)));
            return;
        }

        setReading({
            bookName: translatedBookName,
            chapterNumber,
            chapterData: chapterData,
        });
    }, [getChapterContent, language, showToast]);
    
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
            <h2>{translations.harmony_title[language]}</h2>
            <p>{translations.harmony_description[language]}</p>
            <div className="harmony-list">
                {gospelHarmonyData.map((item, index) => (
                    <HarmonyEvent key={index} item={item} onPassageClick={handlePassageClick} />
                ))}
            </div>
        </div>
    );
};

export default HarmonyView;