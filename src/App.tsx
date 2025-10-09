import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';

// Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { BibleProvider } from './contexts/BibleContext';
import { NotesProvider, useNotes } from './contexts/NotesContext';
import { PlansProvider } from './contexts/PlansContext';
import { BookmarksProvider } from './contexts/BookmarksContext';

// Layout Components
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import SideDrawer from './components/layout/SideDrawer';
import Footer from './components/layout/Footer';

// Views (Lazy Loaded)
const Home = lazy(() => import('./views/Home'));
const BibleDirectory = lazy(() => import('./views/BibleDirectory'));
const ReadingPlans = lazy(() => import('./views/ReadingPlans'));
const Notes = lazy(() => import('./views/Notes'));
const ChatView = lazy(() => import('./views/ChatView'));

// Hooks
import { useNotifications } from './hooks/useNotifications';

// Types
import { Tab, DrawerPage, NoteType, Bookmark } from './types';

// Data
import { translations } from './data/translations';

const AppWithContexts = () => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerPage, setDrawerPage] = useState<DrawerPage>(null);
    const [verseToNavigate, setVerseToNavigate] = useState<Bookmark | null>(null);
    const [initialSearchQuery, setInitialSearchQuery] = useState<string | null>(null);

    const { noteInitialData, initiateNoteCreation } = useNotes();
    const { language } = useLanguage();

    const handleInitiateNoteCreation = useCallback((noteData: Partial<NoteType>) => {
        initiateNoteCreation(noteData);
        setActiveTab('notes');
    }, [initiateNoteCreation, setActiveTab]);
    
    const handleNavigateToVerse = useCallback((verse: Bookmark) => {
        setVerseToNavigate(verse);
        setDrawerOpen(false); // Close drawer
    }, []);

    const handleVerseNavigated = useCallback(() => {
        setVerseToNavigate(null);
    }, []);

    const toggleDrawer = useCallback(() => setDrawerOpen(prev => !prev), []);
    const openDrawerPage = useCallback((page: DrawerPage) => {
        setDrawerPage(page);
        setDrawerOpen(true);
    }, []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);
    const navigateHome = useCallback(() => setActiveTab('home'), []);
    const handleSetActiveTab = useCallback((tab: Tab) => setActiveTab(tab), []);
    
    const handleSearchFromHome = useCallback((query: string) => {
        setInitialSearchQuery(query);
        setActiveTab('bible');
    }, []);

    const handleSearchHandled = useCallback(() => {
        setInitialSearchQuery(null);
    }, []);

    useEffect(() => {
        document.title = translations.appName[language];
    }, [language]);

    useEffect(() => {
        if (noteInitialData) {
            setActiveTab('notes');
        }
    }, [noteInitialData]);

    useEffect(() => {
        if (verseToNavigate) {
            setActiveTab('bible');
        }
    }, [verseToNavigate]);

    useNotifications();

    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <Home setActiveTab={handleSetActiveTab} onSearch={handleSearchFromHome} />;
            case 'bible': return <BibleDirectory verseToNavigate={verseToNavigate} onVerseNavigated={handleVerseNavigated} initialQuery={initialSearchQuery} onSearchHandled={handleSearchHandled} />;
            case 'plans': return <ReadingPlans />;
            case 'notes': return <Notes />;
            case 'chat': return <ChatView />;
            default: return <Home setActiveTab={handleSetActiveTab} onSearch={handleSearchFromHome} />;
        }
    };
    
    return (
        <PlansProvider onInitiateNoteCreation={handleInitiateNoteCreation}>
            <Header 
                activeTab={activeTab} 
                setActiveTab={handleSetActiveTab} 
                onMenuClick={toggleDrawer} 
                onLogoClick={navigateHome} 
            />
            <main className="main-content">
                <Suspense fallback={<div className="spinner-container"><div className="spinner"></div></div>}>
                    {renderContent()}
                </Suspense>
            </main>
            <BottomNav activeTab={activeTab} setActiveTab={handleSetActiveTab} />
            <SideDrawer 
                isOpen={drawerOpen} 
                onClose={closeDrawer} 
                page={drawerPage} 
                onPageClick={openDrawerPage}
                onNavigateToVerse={handleNavigateToVerse}
            />
            <Footer />
        </PlansProvider>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                <LanguageProvider>
                    <BibleProvider>
                        <NotesProvider>
                            <BookmarksProvider>
                                <AppWithContexts />
                            </BookmarksProvider>
                        </NotesProvider>
                    </BibleProvider>
                </LanguageProvider>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;