import React, { useState, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import BackButton from '../common/BackButton';

const MemoChapterItem = React.memo(({ chapterNum, onChapterSelect }: { chapterNum: number, onChapterSelect: (num: number) => void }) => (
    <button id={`chapter-btn-${chapterNum}`} className="chapter-item" onClick={() => onChapterSelect(chapterNum)}>{chapterNum}</button>
));

const ChapterSelectionView = React.memo(({ bookName, totalChapters, onChapterSelect, onBack }: { bookName: string, totalChapters: number, onChapterSelect: (num: number) => void, onBack: () => void }) => {
    const { language } = useLanguage();
    const [jumpToChapter, setJumpToChapter] = useState('');

    const handleJumpToChapter = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const chapterNum = parseInt(jumpToChapter, 10);
        if (chapterNum >= 1 && chapterNum <= totalChapters) {
            const element = document.getElementById(`chapter-btn-${chapterNum}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('highlighted');
                setTimeout(() => {
                    element.classList.remove('highlighted');
                }, 1500);
            }
        }
        setJumpToChapter('');
    }, [jumpToChapter, totalChapters]);

    return (
        <div className="card">
            <BackButton onClick={onBack} text={translations.back_to_books[language]} />
            <h2>{bookName}</h2>
            <p>{translations.select_chapter_prompt[language]}</p>
            
            {totalChapters > 30 && (
                 <form onSubmit={handleJumpToChapter} className="chapter-jump-form">
                    <input
                        type="number"
                        value={jumpToChapter}
                        onChange={(e) => setJumpToChapter(e.target.value)}
                        placeholder={translations.chapter_jump_placeholder[language]}
                        min="1"
                        max={totalChapters}
                        aria-label={translations.chapter_jump_placeholder[language]}
                    />
                    <button type="submit">{translations.chapter_jump_button[language]}</button>
                </form>
            )}

            <div className="chapter-grid">
                {Array.from({ length: totalChapters }, (_, i) => i + 1).map(chapterNum => (
                    <MemoChapterItem key={chapterNum} chapterNum={chapterNum} onChapterSelect={onChapterSelect} />
                ))}
            </div>
        </div>
    );
});

export default ChapterSelectionView;