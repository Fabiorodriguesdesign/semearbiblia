import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { MyReadingPlan, ReadingPlan, NoteType } from '../types';
import { useToast } from './ToastContext';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/translations';
import { debounce } from '../utils/utils';

type PlansContextType = {
    myPlans: MyReadingPlan[];
    addPlan: (plan: ReadingPlan & { data?: any }) => void;
    removePlan: (planId: string) => void;
    updateProgress: (planId: string, readingId: string, isChecked: boolean) => void;
    updateNoteForPlanItem: (planId: string, readingId: string, noteText: string) => void;
    initiateNoteCreation: (noteData: Partial<NoteType>) => void;
};
const PlansContext = createContext<PlansContextType | undefined>(undefined);

export const usePlans = () => {
    const context = useContext(PlansContext);
    if (!context) throw new Error('usePlans must be used within a PlansProvider');
    return context;
};

export const PlansProvider = React.memo(({ children, onInitiateNoteCreation }: React.PropsWithChildren<{ onInitiateNoteCreation: (noteData: Partial<NoteType>) => void }>) => {
    const [myPlans, setMyPlans] = useState<MyReadingPlan[]>([]);
    const { showToast } = useToast();
    const { language } = useLanguage();

    useEffect(() => {
        try {
            const storedPlans = localStorage.getItem('semear_my_plans');
            if (storedPlans) {
                const parsedPlans: MyReadingPlan[] = JSON.parse(storedPlans);
                const sanitizedPlans = parsedPlans.map(p => ({ 
                    ...p, 
                    progress: p.progress || {},
                    notes: p.notes || {} 
                }));
                setMyPlans(sanitizedPlans);
            }
        } catch (error) { console.error("Failed to load plans from localStorage", error); }
    }, []);

    const debouncedSavePlans = useMemo(
        () => debounce((plans: MyReadingPlan[]) => {
            try {
                localStorage.setItem('semear_my_plans', JSON.stringify(plans));
            } catch (error) {
                console.error("Failed to save plans to localStorage", error);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSavePlans(myPlans);
    }, [myPlans, debouncedSavePlans]);

    const addPlan = useCallback((plan: ReadingPlan & { data?: any }) => {
        setMyPlans(prev => {
            if (prev.some(p => p.id === plan.id)) {
                showToast(translations.plan_already_added_toast[language]);
                return prev;
            }
            const newPlan: MyReadingPlan = { ...plan, progress: {}, notes: {} };
            if (plan.data) newPlan.data = plan.data;
            showToast(translations.plan_added_toast[language].replace('{title}', plan.title));
            return [...prev, newPlan];
        });
    }, [showToast, language]);

    const removePlan = useCallback((planId: string) => {
        setMyPlans(prev => prev.filter(p => p.id !== planId));
    }, []);

    const updateProgress = useCallback((planId: string, readingId: string, isChecked: boolean) => {
        setMyPlans(prev => prev.map(p => {
            if (p.id === planId) {
                const newProgress = { ...p.progress, [readingId]: isChecked };
                return { ...p, progress: newProgress };
            }
            return p;
        }));
    }, []);
    
    const updateNoteForPlanItem = useCallback((planId: string, readingId: string, noteText: string) => {
        setMyPlans(prev => prev.map(p => {
            if (p.id === planId) {
                const newNotes = { ...(p.notes || {}), [readingId]: noteText };
                return { ...p, notes: newNotes };
            }
            return p;
        }));
    }, []);

    const value = useMemo(() => ({
        myPlans, addPlan, removePlan, updateProgress, updateNoteForPlanItem,
        initiateNoteCreation: onInitiateNoteCreation
    }), [myPlans, addPlan, removePlan, updateProgress, updateNoteForPlanItem, onInitiateNoteCreation]);
    
    return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>;
});