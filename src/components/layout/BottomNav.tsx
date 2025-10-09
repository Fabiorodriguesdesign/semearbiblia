import React from 'react';
import { Tab } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';

const BottomNav = React.memo(({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (tab: Tab) => void; }) => {
    const { language } = useLanguage();
    const navItems = [
        { id: 'home', icon: 'home', label: translations.nav_home[language] },
        { id: 'bible', icon: 'book', label: translations.nav_bible[language] },
        { id: 'plans', icon: 'event_note', label: translations.nav_plans[language] },
        { id: 'notes', icon: 'edit_note', label: translations.nav_notes[language] },
        { id: 'chat', icon: 'chat', label: translations.nav_chat[language] }
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <button 
                    key={item.id}
                    className={`nav-button ${activeTab === item.id ? 'active' : ''}`} 
                    onClick={() => setActiveTab(item.id as Tab)}
                >
                    <i className="material-icons">{item.icon}</i>
                    <span className="nav-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
});

export default BottomNav;