import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { NoteType } from '../types';
import { debounce } from '../utils/utils';

type NotesContextType = {
    notes: NoteType[];
    saveNote: (noteData: NoteType) => void;
    deleteNote: (id: number) => void;
    noteInitialData: Partial<NoteType> | null;
    initiateNoteCreation: (noteData: Partial<NoteType>) => void;
    onNoteEditorOpened: () => void;
};
const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) throw new Error('useNotes must be used within a NotesProvider');
    return context;
};

export const NotesProvider = React.memo(({ children }: React.PropsWithChildren<{}>) => {
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [noteInitialData, setNoteInitialData] = useState<Partial<NoteType> | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('semear_notes');
        if (stored) setNotes(JSON.parse(stored));
    }, []);

    const debouncedSaveNotes = useMemo(
        () => debounce((nts: NoteType[]) => {
            localStorage.setItem('semear_notes', JSON.stringify(nts));
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSaveNotes(notes);
    }, [notes, debouncedSaveNotes]);
    
    const saveNote = useCallback((noteData: NoteType) => {
        setNotes(prev => {
            if (!noteData.id || !prev.find(n => n.id === noteData.id)) {
                return [{ ...noteData, id: Date.now(), createdAt: new Date().toISOString() }, ...prev];
            } else {
                return prev.map(n => n.id === noteData.id ? noteData : n);
            }
        });
    }, []);

    const deleteNote = useCallback((id: number) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    }, []);
    
    const initiateNoteCreation = useCallback((noteData: Partial<NoteType>) => {
        setNoteInitialData(noteData);
    }, []);
    
    const onNoteEditorOpened = useCallback(() => {
        setNoteInitialData(null);
    }, []);
    
    const value = useMemo(() => ({
        notes, saveNote, deleteNote, noteInitialData, initiateNoteCreation, onNoteEditorOpened
    }), [notes, saveNote, deleteNote, noteInitialData, initiateNoteCreation, onNoteEditorOpened]);

    return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
});