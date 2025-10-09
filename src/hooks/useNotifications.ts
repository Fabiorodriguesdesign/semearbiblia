import { useRef, useCallback, useEffect, useState } from 'react';
import { Language } from '../types';

// Objeto para armazenar os versículos em cache na memória
const verseCache: Partial<Record<Language, any[]>> = {};

// Função para buscar os versículos da API
const fetchVerses = async (lang: Language): Promise<any[]> => {
    // Se já estiver em cache, retorna o cache
    if (verseCache[lang]) {
        return verseCache[lang]!;
    }

    try {
        // Lembre-se de substituir esta URL pela URL real da sua função após o deploy
        const response = await fetch(`https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/getVerseOfTheDay?lang=${lang}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch verses for language: ${lang}`);
        }
        const data = await response.json();
        verseCache[lang] = data; // Armazena no cache
        return data;
    } catch (error) {
        console.error(error);
        return []; // Retorna um array vazio em caso de erro
    }
};

// Função para obter o versículo do dia a partir de uma lista de versículos
export const getTodaysVerse = (verses: any[]) => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return verses[dayOfYear % verses.length];
};

export const useNotifications = () => {
    const notificationTimeoutRef = useRef<number | null>(null);
    const [verses, setVerses] = useState<any[]>([]);
    const lang = (localStorage.getItem('semear_language') as Language) || 'pt';

    // Efeito para buscar os versículos quando o idioma mudar
    useEffect(() => {
        let isMounted = true;
        fetchVerses(lang).then(data => {
            if (isMounted) {
                setVerses(data);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [lang]);

    const scheduleNotification = useCallback(async () => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }

        const isEnabled = localStorage.getItem('notifications_enabled') === 'true';
        if (!isEnabled || typeof Notification === 'undefined' || Notification.permission !== 'granted' || verses.length === 0) {
            return;
        }

        const time = localStorage.getItem('notification_time') || '08:00';
        const [hours, minutes] = time.split(':').map(Number);
        
        const now = new Date();
        const notificationDate = new Date();
        notificationDate.setHours(hours, minutes, 0, 0);

        if (now > notificationDate) {
            notificationDate.setDate(notificationDate.getDate() + 1);
        }

        const timeToNotification = notificationDate.getTime() - now.getTime();

        notificationTimeoutRef.current = window.setTimeout(async () => {
            const verse = getTodaysVerse(verses);
            if (verse) {
                 new Notification(`${verse.book} ${verse.chapter}:${verse.verse}`, { 
                    body: verse.reflection,
                });
            }
            scheduleNotification(); // Re-agenda para o próximo dia
        }, timeToNotification);

    }, [verses]);

    useEffect(() => {
        scheduleNotification();
        const handleSettingsChange = () => scheduleNotification();
        
        window.addEventListener('storage', handleSettingsChange);
        window.addEventListener('settings-changed', handleSettingsChange);

        return () => {
            if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
            window.removeEventListener('storage', handleSettingsChange);
            window.removeEventListener('settings-changed', handleSettingsChange);
        };
    }, [scheduleNotification]);
};
