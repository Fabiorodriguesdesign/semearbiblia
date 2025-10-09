import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NoteType, NoteReference } from '../types';
import { useNotes } from '../contexts/NotesContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getBookList, getCanonicalName, getBookName } from '../data/bibleBooks';
import { translations } from '../data/translations';
import BackButton from '../components/common/BackButton';

const getInitialNoteState = (noteToEdit: Partial<NoteType> | null, defaultBook: string): NoteType => {
    const defaultReference: NoteReference = { date: new Date().toISOString().split('T')[0], book: defaultBook, chapter: '1', verseStart: '1', verseEnd: '' };
    
    if (noteToEdit) {
        const references = (noteToEdit.references && noteToEdit.references.length > 0)
            ? noteToEdit.references
            : [defaultReference];
        return {
            id: 0,
            planTitle: '',
            title: '',
            content: '',
            tags: '',
            createdAt: new Date().toISOString(),
            ...noteToEdit,
            references,
        };
    }
    
    return { 
        id: 0, 
        planTitle: '', 
        title: '', 
        references: [defaultReference], 
        content: '', 
        tags: '', 
        createdAt: new Date().toISOString() 
    };
};

const NoteEditor = ({ noteToEdit, onSave, onCancel, onDelete }: { noteToEdit: Partial<NoteType> | null, onSave: (data: NoteType) => void, onCancel: () => void, onDelete: (id: number) => void }) => {
    const { language } = useLanguage();
    const ALL_BIBLE_BOOKS = useMemo(() => getBookList('all_canon', language), [language]);
    const [note, setNote] = useState(() => getInitialNoteState(noteToEdit, ALL_BIBLE_BOOKS[0]));

    useEffect(() => {
        // This effect ensures that if a note is opened for editing, or the language changes,
        // its book names are displayed in the current language.
        const translatedNote = {
            ...note,
            references: note.references.map(ref => {
                // Try to find canonical name from the stored name (which could be in any language)
                const canonical = getCanonicalName(ref.book, 'pt') || getCanonicalName(ref.book, 'en') || getCanonicalName(ref.book, 'es');
                return {
                    ...ref,
                    // If we found a canonical name, translate it to the current language. Otherwise, keep the original.
                    book: canonical ? getBookName(canonical, language) : ref.book
                }
            })
        }
        setNote(translatedNote);
    }, [language, noteToEdit]); // Rerun when language changes or a new note is opened


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNote(prev => ({ ...prev, [name]: value }));
    };

    const handleReferenceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedReferences = [...note.references];
        updatedReferences[index] = { ...updatedReferences[index], [name]: value };
        setNote(prev => ({ ...prev, references: updatedReferences }));
    };

    const addReference = () => {
        setNote(prev => ({ ...prev, references: [...prev.references, { date: new Date().toISOString().split('T')[0], book: ALL_BIBLE_BOOKS[0], chapter: '1', verseStart: '1', verseEnd: '' }] }));
    };

    const removeReference = (index: number) => {
        if (note.references.length <= 1) return;
        const updatedReferences = note.references.filter((_, i) => i !== index);
        setNote(prev => ({ ...prev, references: updatedReferences }));
    };

    const handleSave = (e: React.FormEvent) => { e.preventDefault(); onSave(note); };
    
    return (
        <div className="card">
            <BackButton onClick={onCancel} text={translations.back[language]} />
            <h2>{noteToEdit && noteToEdit.id ? translations.notes_edit[language] : translations.notes_new[language]}</h2>
            <form onSubmit={handleSave} className="note-editor-form">
                <div className="form-group"><label>{translations.notes_plan_title[language]}</label><input type="text" name="planTitle" value={note.planTitle} onChange={handleChange} placeholder={translations.notes_plan_title_placeholder[language]}/></div>
                <div className="form-group"><label>{translations.notes_note_title[language]}</label><input type="text" name="title" value={note.title} onChange={handleChange} placeholder={translations.notes_note_title_placeholder[language]} required /></div>
                <div className="form-group">
                    <label>{translations.notes_references[language]}</label>
                    <div className="references-list">
                        {note.references.map((ref: NoteReference, index: number) => (
                            <div key={index} className="reference-item">
                                <input type="date" name="date" value={ref.date} onChange={(e) => handleReferenceChange(index, e)} required />
                                <select name="book" value={ref.book} onChange={(e) => handleReferenceChange(index, e)}>
                                    {ALL_BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <input type="number" name="chapter" value={ref.chapter} onChange={(e) => handleReferenceChange(index, e)} placeholder="Cap." min="1" required />
                                <input type="number" name="verseStart" value={ref.verseStart} onChange={(e) => handleReferenceChange(index, e)} placeholder="Início" min="1" required />
                                <input type="number" name="verseEnd" value={ref.verseEnd} onChange={(e) => handleReferenceChange(index, e)} placeholder="Fim" min="1" />
                                <button type="button" className="remove-reference-btn" onClick={() => removeReference(index)}><i className="material-icons">delete_outline</i></button>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="add-reference-btn" onClick={addReference}><i className="material-icons">add</i> {translations.notes_add_reading[language]}</button>
                </div>
                <div className="form-group"><label>{translations.notes_content[language]}</label><textarea name="content" rows={8} value={note.content} onChange={handleChange} placeholder={translations.notes_content_placeholder[language]}></textarea></div>
                <div className="form-group"><label>{translations.notes_tags[language]}</label><input type="text" name="tags" value={note.tags} onChange={handleChange} placeholder={translations.notes_tags_placeholder[language]} /></div>
                <div className="note-editor-actions">
                    {noteToEdit && noteToEdit.id ? <button type="button" className="delete-button" onClick={() => onDelete(noteToEdit.id!)}><i className="material-icons" style={{marginRight: '8px', fontSize: '1.2rem'}}>delete</i>{translations.delete[language]}</button> : <div></div>}
                    <button type="submit" className="action-button"><i className="material-icons" style={{marginRight: '8px', fontSize: '1.2rem'}}>save</i>{translations.notes_save[language]}</button>
                </div>
            </form>
        </div>
    );
};

const NoteCard = React.memo(({ note, onEdit, onShare }: { note: NoteType; onEdit: (note: NoteType) => void; onShare: (note: NoteType) => void; }) => {
    const { language } = useLanguage();
    const handleShareClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onShare(note);
    }, [note, onShare]);

    return (
        <div className="note-card" onClick={() => onEdit(note)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEdit(note)}>
            {note.planTitle && <p className="note-card-plan-title">{note.planTitle}</p>}
            <h3>{note.title}</h3>
            <p className="note-card-content">{note.content.substring(0, 100)}...</p>
            <div className="note-card-footer">
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                <div className="note-card-footer-right">
                    {note.tags && <span className="note-card-tags">{note.tags}</span>}
                    <button className="note-card-action-btn" onClick={handleShareClick} aria-label={translations.share[language]}>
                        <i className="material-icons">share</i>
                    </button>
                </div>
            </div>
        </div>
    );
});


const Notes = () => {
    const { notes, saveNote, deleteNote, noteInitialData, onNoteEditorOpened } = useNotes();
    const { showToast } = useToast();
    const { language } = useLanguage();
    const [editingNote, setEditingNote] = useState<Partial<NoteType> | null>(null);

    useEffect(() => {
        if (noteInitialData && !editingNote) {
            setEditingNote(noteInitialData);
            onNoteEditorOpened();
        }
    }, [noteInitialData, editingNote, onNoteEditorOpened]);

    const handleEdit = useCallback((note: NoteType) => setEditingNote(note), []);
    const handleNew = useCallback(() => setEditingNote({}), []);
    const handleCancel = useCallback(() => setEditingNote(null), []);

    const handleSave = useCallback((noteData: NoteType) => {
        const isNew = !noteData.id || noteData.id === 0;
        saveNote(noteData);
        setEditingNote(null);
        showToast(isNew ? translations.note_created_toast[language] : translations.note_updated_toast[language]);
    }, [saveNote, showToast, language]);
    
    const handleDelete = useCallback((id: number) => {
        if (window.confirm(translations.confirm_delete[language])) {
            deleteNote(id);
            setEditingNote(null);
            showToast(translations.note_deleted_toast[language]);
        }
    }, [deleteNote, showToast, language]);
    
    const handleShare = useCallback(async (note: NoteType) => {
        const appName = translations.appName[language];
        const shareText = `
*${translations.notes_share_text_title[language].replace('{appName}', appName)}*

*${translations.notes_share_text_note_title[language]}:* ${note.title}
*${translations.notes_share_text_plan[language]}:* ${note.planTitle || translations.notes_share_text_not_applicable[language]}

*${translations.notes_share_text_references[language]}:*
${note.references.map(r => {
    const canonical = getCanonicalName(r.book, 'pt') || getCanonicalName(r.book, 'en') || getCanonicalName(r.book, 'es');
    const translatedBook = canonical ? getBookName(canonical, language) : r.book;
    return `- ${translatedBook} ${r.chapter}:${r.verseStart}${r.verseEnd ? `-${r.verseEnd}`: ''}`;
}).join('\n')}

---
${note.content}
        `;
        try {
            await navigator.clipboard.writeText(shareText.trim());
            showToast(translations.copied_to_clipboard[language]);
        } catch (err) {
            showToast(translations.copy_failed[language]);
            console.error('Failed to copy text: ', err);
        }
    }, [language, showToast]);


    if (editingNote) {
        return <NoteEditor noteToEdit={editingNote} onSave={handleSave} onCancel={handleCancel} onDelete={handleDelete} />;
    }

    return (
        <div className="card">
            <h2>{translations.notes_title[language]}</h2>
            <p>{translations.notes_desc[language]}</p>
            <div className="notes-list">
                {notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(note => (
                    <NoteCard key={note.id} note={note} onEdit={handleEdit} onShare={handleShare} />
                ))}
            </div>
            <button onClick={handleNew} className="fab" aria-label={translations.notes_new[language]}>
                <i className="material-icons">add</i>
            </button>
        </div>
    );
};

export default Notes;
