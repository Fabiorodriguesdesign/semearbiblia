import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MyReadingPlan, ReadingPlan } from '../types';
import { usePlans } from '../contexts/PlansContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getReadingPlansData, getPlanDetails } from '../data/readingPlans';
import { translations } from '../data/translations';
import BackButton from '../components/common/BackButton';

interface GeminiPlanResponse {
    diagnosis: string;
    priorityBook: string;
    structure: string;
    firstWeekReadings: string[];
    finalAdvice: string;
}

const PlanGeneratorForm = React.memo(({ onGenerate, onBack, isGenerating }: { onGenerate: (data: any) => void, onBack: () => void, isGenerating: boolean }) => {
    const { language } = useLanguage();
    const [formData, setFormData] = useState({ version: 'Evangélica', time: '30 minutos', frequency: '5 dias/semana', goal: '', preference: 'Mista' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onGenerate(formData); };
    return (
        <div className="card">
            <BackButton onClick={onBack} text={translations.back[language]} />
            <h2>{translations.plan_generator_title[language]}</h2>
            <p>{translations.plan_generator_desc[language]}</p>
            <form onSubmit={handleSubmit} className="plan-generator-form">
                <div className="form-group"><label>{translations.plan_generator_version_label[language]}</label><select name="version" value={formData.version} onChange={handleChange}><option>{translations.plan_generator_version_option_evangelical[language]}</option><option>{translations.plan_generator_version_option_catholic[language]}</option></select></div>
                <div className="form-group"><label>{translations.plan_generator_time_label[language]}</label><select name="time" value={formData.time} onChange={handleChange}><option>{translations.plan_generator_time_option_15[language]}</option><option>{translations.plan_generator_time_option_30[language]}</option><option>{translations.plan_generator_time_option_45[language]}</option><option>{translations.plan_generator_time_option_60[language]}</option></select></div>
                <div className="form-group"><label>{translations.plan_generator_frequency_label[language]}</label><select name="frequency" value={formData.frequency} onChange={handleChange}><option>{translations.plan_generator_frequency_option_5[language]}</option><option>{translations.plan_generator_frequency_option_7[language]}</option></select></div>
                <div className="form-group"><label>{translations.plan_generator_goal_label[language]}</label><textarea name="goal" rows={3} value={formData.goal} onChange={handleChange} placeholder={translations.plan_generator_goal_placeholder[language]}></textarea></div>
                <div className="form-group"><label>{translations.plan_generator_preference_label[language]}</label><select name="preference" value={formData.preference} onChange={handleChange}><option value="Linear">{translations.plan_generator_preference_option_linear[language]}</option><option value="Temática">{translations.plan_generator_preference_option_thematic[language]}</option><option value="Mista">{translations.plan_generator_preference_option_mixed[language]}</option></select></div>
                <div className="form-actions">
                    <button type="submit" className="action-button" disabled={isGenerating}>
                        {isGenerating ? <><div className="spinner"></div><span>{translations.plan_generator_generating_button[language]}</span></> : translations.plan_generator_submit_button[language]}
                    </button>
                </div>
            </form>
        </div>
    );
});
const GeneratedPlanView = React.memo(({ planData, onBack, onAddPlan }: { planData: { id: string; title: string; content: React.ReactNode; }, onBack: () => void, onAddPlan: (plan: ReadingPlan) => void }) => {
    const { language } = useLanguage();
    const { showToast } = useToast();
    const handleAdd = () => {
        onAddPlan({
            id: planData.id,
            title: planData.title,
            description: translations.plan_desc_custom_ai[language],
        });
        showToast(translations.generated_plan_added_toast[language]);
        onBack();
    };
    
    return (
        <div className="card generated-plan-view">
            <BackButton onClick={onBack} text={translations.back[language]} />
            <h2>{planData.title}</h2>
            {planData.content}
            <div className="form-actions">
                 <button className="action-button" onClick={handleAdd}>
                     <i className="material-icons">add_circle_outline</i> {translations.add_plan[language]}
                 </button>
            </div>
        </div>
    );
});

const ChecklistItem = React.memo(({
    itemId,
    itemText,
    planId,
    isChecked,
    note,
    index,
    updateProgress,
    updateNoteForPlanItem
}: {
    itemId: string;
    itemText: string;
    planId: string;
    isChecked: boolean;
    note: string | undefined;
    index: number;
    updateProgress: (planId: string, itemId: string, isChecked: boolean) => void;
    updateNoteForPlanItem: (planId: string, itemId: string, noteText: string) => void;
}) => {
    const { showToast } = useToast();
    const { language } = useLanguage();

    const [isEditing, setIsEditing] = useState(false);
    const [noteText, setNoteText] = useState(note || '');

    useEffect(() => {
        setNoteText(note || '');
    }, [note]);

    const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateProgress(planId, itemId, e.target.checked);
    }, [updateProgress, planId, itemId]);

    const handleEditClick = useCallback(() => {
        setIsEditing(prev => !prev);
    }, []);

    const handleCancelClick = useCallback(() => {
        setIsEditing(false);
        setNoteText(note || ''); // Reset text on cancel
    }, [note]);

    const handleSaveNote = useCallback(() => {
        updateNoteForPlanItem(planId, itemId, noteText);
        showToast(translations.note_saved_toast[language]);
        setIsEditing(false);
    }, [noteText, planId, itemId, showToast, updateNoteForPlanItem, language]);

    return (
        <li className="checklist-item-wrapper">
            <div className="checklist-item">
                <label htmlFor={`${planId}-${itemId}`}>
                    <input type="checkbox" id={`${planId}-${itemId}`} checked={isChecked} onChange={handleProgressChange} />
                    <span className="item-text"><span className="item-text--number">{index + 1}.</span> {itemText}</span>
                </label>
                <button className="add-note-for-item-btn" onClick={handleEditClick} aria-label={translations.add_note_for_aria[language].replace('{item}', itemText)}>
                    <i className="material-icons">{note ? 'edit_note' : 'note_add'}</i>
                </button>
            </div>
            {note && !isEditing && (
                <div className="quick-note-display">{note}</div>
            )}
            {isEditing && (
                <div className="quick-note-editor">
                    <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder={translations.notes_quick_note_placeholder[language]} rows={3} autoFocus />
                    <div className="quick-note-editor-actions">
                         <button className="quick-note-save-btn" onClick={handleSaveNote}>{translations.save[language]}</button>
                         <button className="quick-note-cancel-btn" onClick={handleCancelClick}>{translations.cancel[language]}</button>
                    </div>
                </div>
            )}
        </li>
    );
});


const MyPlanCard = React.memo(({ plan }: { plan: MyReadingPlan }) => {
    const { removePlan, initiateNoteCreation, updateProgress, updateNoteForPlanItem } = usePlans();
    const { language } = useLanguage();
    const planDetails = useMemo(() => getPlanDetails(plan, language), [plan, language]);

    const [isExpanded, setIsExpanded] = useState(false);

    const percentage = useMemo(() => {
        if (!planDetails) return 0;
        const completedCount = Object.values(plan.progress || {}).filter(Boolean).length;
        let totalCount = 0;
        if (planDetails.type === 'book-based' && planDetails.flatChecklist) {
            totalCount = planDetails.flatChecklist.length;
        } else if (planDetails.checklist) {
            totalCount = (planDetails.checklist as any[]).length;
        }
        return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    }, [plan.progress, planDetails]);

    const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), []);

    const handleRemoveClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        removePlan(plan.id);
    }, [removePlan, plan.id]);
    
    const renderPlanContent = () => {
        if (!planDetails) {
            return <p style={{padding: "1rem 0"}}>{plan.description}</p>;
        }

        const renderChecklistItem = (item: any, index: number) => (
             <ChecklistItem 
                key={item.id} 
                itemId={item.id} 
                itemText={item.text} 
                planId={plan.id} 
                isChecked={!!plan.progress[item.id]} 
                note={plan.notes?.[item.id]} 
                index={index}
                updateProgress={updateProgress}
                updateNoteForPlanItem={updateNoteForPlanItem}
            />
        );

        const renderChecklistContent = (list: any[], hasCategories: boolean) => (
            <div className="plan-checklist-container">
                {hasCategories ? (
                    Object.entries(list.reduce((acc, item) => {
                        const category = item.category || 'Outros';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(item);
                        return acc;
                    }, {} as Record<string, typeof list>)).map(([category, items]) => (
                        <div key={category} className="checklist-category-section">
                            <h4 className="checklist-category-header">{category}</h4>
                            <ul className="plan-checklist">{items.map(renderChecklistItem)}</ul>
                        </div>
                    ))
                ) : (
                    <ul className="plan-checklist">{list.map(renderChecklistItem)}</ul>
                )}
            </div>
        );

        const renderBookBasedContent = (bookList: any[]) => {
            let itemCounter = 0;
            return (
                <div className="plan-checklist-container">
                    {bookList.map(testament => (
                        <div key={testament.testament} className="testament-section">
                            <h4 className="checklist-testament-header">{testament.emoji} {testament.testament}</h4>
                            <ul className="plan-checklist">
                                {testament.items.map((item: any) => {
                                    const renderedItem = renderChecklistItem(item, itemCounter);
                                    itemCounter++;
                                    return renderedItem;
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            );
        };
        
        let content;
        switch (planDetails.type) {
            case 'book-based': content = renderBookBasedContent(planDetails.checklist); break;
            case 'thematic': content = renderChecklistContent(planDetails.checklist, false); break;
            case 'categorized': content = renderChecklistContent(planDetails.checklist, true); break;
            case 'simple': content = renderChecklistContent(planDetails.checklist, false); break;
            default: return <p style={{padding: "1rem 0"}}>{plan.description}</p>;
        }
        
        return (
            <div className="plan-progress-container">
                <div className="progress-bar-info">
                    <span className="progress-bar-label">{translations.my_plan_progress[language]}</span>
                    <span className="progress-percentage">{percentage}%</span>
                </div>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div></div>
                {content}
            </div>
        );
    };

    return (
        <div className={`my-plan-card ${isExpanded ? 'expanded' : ''}`}>
            <button className="my-plan-card__header" onClick={toggleExpand} aria-expanded={isExpanded}>
                <h3>{plan.title}</h3>
                <div className="my-plan-card__header-actions">
                    <button className="my-plan-card__remove-btn" onClick={handleRemoveClick} aria-label={translations.remove_plan_aria[language]}>
                        <i className="material-icons">close</i>
                    </button>
                    <span className="my-plan-card__expand-icon" aria-hidden="true">
                        <i className="material-icons">expand_more</i>
                    </span>
                </div>
            </button>
            <div className="my-plan-card__content-wrapper">
                {isExpanded && renderPlanContent()}
                <div className="plan-actions">
                    <button className="add-note-to-plan-btn" onClick={() => initiateNoteCreation({ planTitle: plan.title })}>
                        <i className="material-icons">edit_note</i><span>{translations.notes_new[language]}</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

const SuggestedPlanCard = React.memo(({ plan, onAdd }: { plan: ReadingPlan, onAdd: (plan: ReadingPlan) => void }) => {
    const { language } = useLanguage();
    return (
        <div className="plan-item">
            <div className="plan-item-content">
                <h3>{plan.title}</h3>
                <p className="plan-item-description">{plan.description}</p>
                <div className="plan-item-details">
                    <div className="plan-item-audience">
                        <i className="material-icons">person</i>
                        <div><strong>{translations.plan_audience[language]}</strong><span>{plan.audience}</span></div>
                    </div>
                    <div className="plan-item-benefit">
                        <i className="material-icons">star</i>
                        <div><strong>{translations.plan_benefit[language]}</strong><span>{plan.benefit}</span></div>
                    </div>
                </div>
            </div>
            <button className="add-plan-btn" onClick={() => onAdd(plan)} aria-label={translations.add_plan_for_aria[language].replace('{title}', plan.title)}><i className="material-icons">add</i></button>
        </div>
    );
});

const ReadingPlans = () => {
    const { myPlans, addPlan } = usePlans();
    const [view, setView] = useState<'list' | 'form' | 'generated'>('list');
    const [generatedPlanData, setGeneratedPlanData] = useState<{ id: string; title: string; content: React.ReactNode } | null>(null);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const { showToast } = useToast();
    const { language } = useLanguage();
    
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);
    const readingPlansData = useMemo(() => getReadingPlansData(language), [language]);

    const handleBackToList = useCallback(() => setView('list'), []);

    const handleGeneratePlan = useCallback(async (formData: any) => {
        setIsGeneratingPlan(true);

        const { version, time, frequency, goal, preference } = formData;
        
        const langMap = { pt: 'português do Brasil', en: 'American English', es: 'Español' };
        const currentLang = langMap[language] || 'português do Brasil';
        
        const systemInstruction = `You are a wise and empathetic Bible study assistant. Your goal is to create personalized, encouraging, and practical Bible reading plans. The response MUST be a valid JSON object that adheres to the provided schema. The response language must be ${currentLang}.`;

        const prompt = `Create a personalized Bible reading plan based on the following user preferences:
- Preferred Bible version: ${version}
- Daily time available: ${time}
- Weekly reading frequency: ${frequency}
- Goal or current life situation: "${goal || 'Not specified, create a general plan for deepening faith.'}"
- Reading style preference: ${preference}`;
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                diagnosis: { type: Type.STRING, description: "Empathetic analysis of the user's situation in 1-2 sentences." },
                priorityBook: { type: Type.STRING, description: "The main book or section of the Bible to read." },
                structure: { type: Type.STRING, description: "How the user should structure their reading based on the time available." },
                firstWeekReadings: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of specific readings (book and chapters) for the first week." 
                },
                finalAdvice: { type: Type.STRING, description: "A final piece of advice or an encouraging thought." }
            },
            required: ["diagnosis", "priorityBook", "structure", "firstWeekReadings", "finalAdvice"]
        };

        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });
            
            const responseText = response.text.trim();
            if (!responseText) {
                throw new Error("Empty response from AI.");
            }

            const planJson = JSON.parse(responseText) as GeminiPlanResponse;

            const planContent = (
                <>
                    <h3>Diagnóstico:</h3>
                    <p>{planJson.diagnosis}</p>
                    <h3>Sugestão de Leitura:</h3>
                    <ul>
                        <li><strong>Prioridade:</strong> {planJson.priorityBook}</li>
                        <li><strong>Estrutura do Plano:</strong> {planJson.structure}</li>
                        <li>
                            <strong>Primeiras Leituras (Semana 1):</strong>
                            <ul>
                                {/* Fix: Use a type guard to ensure `firstWeekReadings` is an array before mapping. This correctly narrows the type from 'unknown' and allows safe use of the .map() method. */}
                                {Array.isArray(planJson.firstWeekReadings) && planJson.firstWeekReadings.map((reading, index) => <li key={index}>{reading}</li>)}
                            </ul>
                        </li>
                    </ul>
                    <h3>Conselho Final:</h3>
                    <p>{planJson.finalAdvice}</p>
                </>
            );

            setGeneratedPlanData({
                id: `custom-ai-${Date.now()}`,
                title: translations.generated_plan_title[language],
                content: planContent
            });
            setView('generated');
        } catch (error) {
            console.error("Erro ao gerar plano com IA:", error);
            showToast(translations.error_generic[language]);
        } finally {
            setIsGeneratingPlan(false);
        }
    }, [ai, showToast, language]);

    if (view === 'form') {
        return <PlanGeneratorForm onGenerate={handleGeneratePlan} onBack={handleBackToList} isGenerating={isGeneratingPlan} />;
    }

    if (view === 'generated' && generatedPlanData) {
        return <GeneratedPlanView planData={generatedPlanData} onBack={handleBackToList} onAddPlan={addPlan} />;
    }

    return (
        <>
            <div className="my-plans-section">
                <h3 className="section-title">{translations.plans_my_progress[language]}</h3>
                {myPlans.length === 0 ? (
                    <div className="my-plans-empty-state">
                        <i className="material-icons">dashboard</i>
                        <p>{translations.plans_empty_state[language]}</p>
                    </div>
                ) : (
                    <div className="my-plans-list">
                        {myPlans.map(plan => <MyPlanCard key={plan.id} plan={plan} />)}
                    </div>
                )}
            </div>

            <div className="card">
                <h2>{translations.plans_suggested[language]}</h2>
                <p>{translations.plans_suggested_desc[language]}</p>
                <button className="create-plan-btn" onClick={() => setView('form')}><i className="material-icons">auto_awesome</i><span>{translations.plans_create_ai[language]}</span></button>
                <div className="plan-list">
                    {readingPlansData.map(plan => (
                       <SuggestedPlanCard key={plan.id} plan={plan} onAdd={addPlan} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ReadingPlans;