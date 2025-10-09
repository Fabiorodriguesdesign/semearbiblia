import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';

const Footer = React.memo(() => {
    const { language } = useLanguage();
    return (
        <footer className="app-footer">
            {translations.drawer_developed_by[language]} <a href="https://www.fabiorodriguesdesign.com" target="_blank" rel="noopener noreferrer">Fabio Rodrigues Design</a> | <a href="https://www.instagram.com/fabiorodriguesdsgn" target="_blank" rel="noopener noreferrer">@fabiorodriguesdsgn</a>.
        </footer>
    );
});

export default Footer;