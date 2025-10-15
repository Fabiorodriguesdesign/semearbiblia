import { useRef, useCallback, useEffect } from 'react';
import { Language } from '../types';
import { getDynamicVerseOfTheDay } from '../utils/verseUtils'; // Nova importação

export const useNotifications = () => {
    const notificationTimeoutRef = useRef<number | null>(null);

    const scheduleNotification = useCallback(async () => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }

        const isEnabled = localStorage.getItem('notifications_enabled') === 'true';
        if (!isEnabled || typeof Notification === 'undefined' || Notification.permission !== 'granted') {
            return;
        }

        const time = localStorage.getItem('notification_time') || '08:00';
        const lang = (localStorage.getItem('semear_language') as Language) || 'pt';
        const [hours, minutes] = time.split(':').map(Number);
        
        const now = new Date();
        const notificationDate = new Date();
        notificationDate.setHours(hours, minutes, 0, 0);

        if (now > notificationDate) {
            notificationDate.setDate(notificationDate.getDate() + 1);
        }

        const timeToNotification = notificationDate.getTime() - now.getTime();

        notificationTimeoutRef.current = window.setTimeout(async () => {
            console.log('Enviando notificação do versículo do dia...');
            const verse = await getDynamicVerseOfTheDay(lang);
            
            if (verse) {
                 new Notification(`${verse.book} ${verse.chapter}:${verse.verse}`, { 
                    body: `"${verse.text}"\n\n${verse.reflection}`,
                    icon: '/logo192.png' // Adiciona um ícone para uma aparência melhor
                });
            }

            scheduleNotification(); // Re-agenda para o próximo dia
        }, timeToNotification);

    }, []);

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
