import React, { useCallback } from 'react';
import { ReadingPlan } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import { archaeologyData } from '../data/archaeologyData';
import BackButton from '../components/common/BackButton';

const ArchaeologyView = ({ onBack, onAddPlan }: { onBack: () => void, onAddPlan: (plan: ReadingPlan) => void; }) => {
    const { language } = useLanguage();
    const handleAddArchaeologyPlan = useCallback((item: { title: string; description: string }) => {
        const plan: ReadingPlan = {
            id: `arch_${item.title.replace(/\s/g, '_').slice(0, 20)}`,
            title: `Estudo: ${item.title}`,
            description: item.description,
        };
        onAddPlan(plan);
    }, [onAddPlan]);

    return (
        <div className="card archaeology-container">
            <BackButton onClick={onBack} text={translations.back[language]} />
            <h2>{translations.archaeology_title[language]}</h2>
            <p>{translations.archaeology_description[language]}</p>
            {archaeologyData.map(category => (
                <div key={category.category} className="archaeology-category">
                    <h3 className="archaeology-category-title">{category.category}</h3>
                    <div className="archaeology-items-grid">
                        {category.items.map(item => (
                            <div key={item.title} className="archaeology-item">
                                <div className="archaeology-item-content">
                                    <h4 className="archaeology-item-title">{item.title}</h4>
                                    <p className="archaeology-item-description">{item.description}</p>
                                </div>
                                 <button className="add-item-plan-btn" onClick={() => handleAddArchaeologyPlan(item)} aria-label={translations.add_plan_for_aria[language].replace('{title}', item.title)}>+</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArchaeologyView;