import React from 'react';
import { BookDataType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import BackButton from '../common/BackButton';

const MemoChapterItem = React.memo(({ chapterNum, onChapterSelect }: { chapterNum: number, onChapterSelect: (num: number) => void }) => (
    <button className="chapter-item" onClick={() => onChapterSelect(chapterNum)}>{chapterNum}</button>
));

const ChapterSelectionView = React.memo(({ bookName, bookData, onChapterSelect, onBack }: { bookName: string, bookData: BookDataType, onChapterSelect: (num: number) => void, onBack: () => void }) => {
    const { language } = useLanguage();
    return (
        <div className="card">
            <BackButton onClick={onBack} text={translations.back_to_books[language]} />
            <h2>{bookName}</h2>
            <p>{translations.select_chapter_prompt[language]}</p>
            <div className="chapter-grid">
                {Array.from({ length: bookData.chapters.length }, (_, i) => i + 1).map(chapterNum => (
                    <MemoChapterItem key={chapterNum} chapterNum={chapterNum} onChapterSelect={onChapterSelect} />
                ))}
            </div>
        </div>
    );
});

export default ChapterSelectionView;