import React, { useState, useEffect, createContext, useContext, useMemo, useCallback, useRef } from 'react';

type ToastContextType = { showToast: (message: string) => void; };
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = React.memo(({ children }: React.PropsWithChildren<{}>) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const showToast = useCallback((message: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setToastMessage(message);
        timeoutRef.current = window.setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    }, []);
    
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {toastMessage && <div className="toast-notification">{toastMessage}</div>}
        </ToastContext.Provider>
    );
});
