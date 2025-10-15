import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';

const Footer = React.memo(() => {
    const { language } = useLanguage();
    return (
        <footer className="app-footer">
            <a href="https://flow.fabiorodriguesdesign.com/" className="footer-flow-button">
                {translations.back_to_flow[language]}
            </a>
            <div className="footer-credits">
                {translations.made_by[language]} <a href="https://www.fabiorodriguesdesign.com/" target="_blank" rel="noopener noreferrer">Fabio Rodrigues Design</a> | <a href="https://www.instagram.com/fabiorodriguesdsgn" target="_blank" rel="noopener noreferrer">@fabiorodriguesdsgn</a>
            </div>
        </footer>
    );
});

export default Footer;