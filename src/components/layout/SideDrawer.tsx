import React, { useState, useCallback } from 'react';
import { DrawerPage, Language, Bookmark } from '../../types';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useBookmarks } from '../../contexts/BookmarksContext';
import { translations } from '../../data/translations';
import { getCanonicalName, getBookName } from '../../data/bibleBooks';
import BackButton from '../common/BackButton';

const BookmarksPage = React.memo(({ onBack, onNavigate }: { onBack: () => void, onNavigate: (bookmark: Bookmark) => void }) => {
    const { bookmarks, removeBookmark } = useBookmarks();
    const { language } = useLanguage();

    const handleRemove = (e: React.MouseEvent, bookmark: Bookmark) => {
        e.stopPropagation();
        removeBookmark(bookmark.book, bookmark.chapter, bookmark.verse);
    };

    return (
        <div className="bookmarks-page-content">
            <div className="bookmarks-header">
                <BackButton onClick={onBack} text={translations.settings_back_to_menu[language]} />
                <h2>{translations.bookmarks_title[language]}</h2>
                <p>{translations.bookmarks_description[language]}</p>
            </div>
            {bookmarks.length > 0 ? (
                <ul className="bookmarks-list">
                    {bookmarks.map((bookmark, index) => {
                        const canonicalName = getCanonicalName(bookmark.book, 'pt') || getCanonicalName(bookmark.book, 'en') || getCanonicalName(bookmark.book, 'es') || bookmark.book;
                        const translatedBookName = getBookName(canonicalName, language);
                        
                        return (
                            <li key={`${bookmark.book}-${bookmark.chapter}-${bookmark.verse}-${index}`} className="bookmark-item">
                                <button className="bookmark-item__button" onClick={() => onNavigate(bookmark)}>
                                    <div className="bookmark-item__content">
                                        <div className="bookmark-item__ref">{translatedBookName} {bookmark.chapter}:{bookmark.verse}</div>
                                        <p className="bookmark-item__text">{bookmark.text}</p>
                                    </div>
                                </button>
                                <button className="bookmark-item__remove-btn" onClick={(e) => handleRemove(e, bookmark)} aria-label={translations.remove_bookmark_aria[language]}>
                                    <i className="material-icons">delete_outline</i>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="bookmarks-empty-state">
                    <i className="material-icons">bookmark_border</i>
                    <p>{translations.bookmarks_empty[language]}</p>
                </div>
            )}
        </div>
    );
});


const SideDrawerContent = React.memo(({ onPageClick, onClose }: { onPageClick: (page: DrawerPage) => void, onClose: () => void }) => {
    const { canInstall, handleInstall } = usePWAInstall();
    const { language } = useLanguage();
    return (
        <>
            <div className="drawer-header">{translations.drawer_menu[language]}</div>
            <ul className="drawer-nav">
                <li><button onClick={() => onPageClick('bookmarks')}><i className="material-icons">bookmark_border</i> {translations.drawer_bookmarks[language]}</button></li>
                <li><button onClick={() => onPageClick('settings')}><i className="material-icons">settings</i> {translations.settings_title[language]}</button></li>
                {canInstall && <li><button onClick={handleInstall}><i className="material-icons">install_mobile</i> {translations.drawer_install_app[language]}</button></li>}
            </ul>
            <div className="drawer-footer">
                <strong>{translations.appName[language]}</strong> v1.0<br />
                {translations.drawer_developed_by[language]} <a href="https://www.fabiorodriguesdesign.com" target="_blank" rel="noopener noreferrer">Fabio Rodrigues Design</a> | <a href="https://www.instagram.com/fabiorodriguesdsgn" target="_blank" rel="noopener noreferrer">@fabiorodriguesdsgn</a>.
            </div>
        </>
    );
});

const SettingsPage = React.memo(({ onBack }: { onBack: () => void }) => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem('notifications_enabled') === 'true');
    const [notificationTime, setNotificationTime] = useState(localStorage.getItem('notification_time') || '08:00');
    
    const handleNotificationToggle = async (enabled: boolean) => {
        if (enabled && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') return;
        }
        setNotificationsEnabled(enabled);
        localStorage.setItem('notifications_enabled', String(enabled));
        window.dispatchEvent(new Event('settings-changed'));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setNotificationTime(newTime);
        localStorage.setItem('notification_time', newTime);
         window.dispatchEvent(new Event('settings-changed'));
    };

    return (
        <div className="card">
            <BackButton onClick={onBack} text={translations.settings_back_to_menu[language]} />
            <h2>{translations.settings_title[language]}</h2>
            <div className="setting-item">
                <label htmlFor="language-select">{translations.settings_language[language]}</label>
                <select id="language-select" className="language-select" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                    <option value="pt">{translations.language_pt[language]}</option>
                    <option value="en">{translations.language_en[language]}</option>
                    <option value="es">{translations.language_es[language]}</option>
                </select>
            </div>
            <div className="setting-item">
                <span>{translations.settings_dark_mode[language]}</span>
                <label className="switch"><input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} /><span className="slider round"></span></label>
            </div>
             <div className="setting-item">
                <span>{translations.settings_daily_notification[language]}</span>
                <label className="switch"><input type="checkbox" checked={notificationsEnabled} onChange={(e) => handleNotificationToggle(e.target.checked)} /><span className="slider round"></span></label>
            </div>
            {notificationsEnabled && (
                <div className="setting-item">
                    <span>{translations.settings_notification_time[language]}</span>
                    <input type="time" className="time-input" value={notificationTime} onChange={handleTimeChange} />
                </div>
            )}
        </div>
    );
});


const SideDrawer = React.memo(({ isOpen, onClose, page, onPageClick, onNavigateToVerse }: { isOpen: boolean, onClose: () => void, page: DrawerPage, onPageClick: (page: DrawerPage) => void, onNavigateToVerse: (bookmark: Bookmark) => void }) => {
    if (!isOpen) return null;
    const handleBack = useCallback(() => onPageClick(null), [onPageClick]);
    
    const renderPage = () => {
        switch(page) {
            case 'settings':
                return <SettingsPage onBack={handleBack} />;
            case 'bookmarks':
                return <BookmarksPage onBack={handleBack} onNavigate={onNavigateToVerse} />;
            default:
                return <SideDrawerContent onPageClick={onPageClick} onClose={onClose} />;
        }
    }
    
    return (
        <>
            <div className="drawer-overlay" onClick={onClose}></div>
            <aside className={`side-drawer ${isOpen ? 'open' : ''}`}>
                {renderPage()}
            </aside>
        </>
    );
});

export default SideDrawer;
