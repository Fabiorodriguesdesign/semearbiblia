import { ReadingPlan, MyReadingPlan, Language } from "../types";
import { getBookList, getChapterCount, getBookName } from "./bibleBooks";
import { gospelHarmonyData } from './harmonyData';
import { archaeologyData } from './archaeologyData';
import { thematicReadingData } from './thematicData';
import { translations } from "./translations";

export const getReadingPlansData = (language: Language): ReadingPlan[] => [
    {
        id: 'cronologica',
        title: translations.rp_cronologica_title[language],
        description: translations.rp_cronologica_desc[language],
        audience: translations.rp_cronologica_audience[language],
        benefit: translations.rp_cronologica_benefit[language],
    },
    {
        id: 'anual_tradicional',
        title: translations.rp_anual_tradicional_title[language],
        description: translations.rp_anual_tradicional_desc[language],
        audience: translations.rp_anual_tradicional_audience[language],
        benefit: translations.rp_anual_tradicional_benefit[language],
    },
    {
        id: 'mista',
        title: translations.rp_mista_title[language],
        description: translations.rp_mista_desc[language],
        audience: translations.rp_mista_audience[language],
        benefit: translations.rp_mista_benefit[language],
    },
    {
        id: 'mcheyne',
        title: translations.rp_mcheyne_title[language],
        description: translations.rp_mcheyne_desc[language],
        audience: translations.rp_mcheyne_audience[language],
        benefit: translations.rp_mcheyne_benefit[language],
    },
    {
        id: 'lectio_divina',
        title: translations.rp_lectio_divina_title[language],
        description: translations.rp_lectio_divina_desc[language],
        audience: translations.rp_lectio_divina_audience[language],
        benefit: translations.rp_lectio_divina_benefit[language],
    },
    {
        id: 'ritmo_iniciante',
        title: translations.rp_ritmo_iniciante_title[language],
        description: translations.rp_ritmo_iniciante_desc[language],
        audience: translations.rp_ritmo_iniciante_audience[language],
        benefit: translations.rp_ritmo_iniciante_benefit[language],
    },
    {
        id: 'profetas',
        title: translations.rp_profetas_title[language],
        description: translations.rp_profetas_desc[language],
        audience: translations.rp_profetas_audience[language],
        benefit: translations.rp_profetas_benefit[language],
    },
    {
        id: 'sabedoria',
        title: translations.rp_sabedoria_title[language],
        description: translations.rp_sabedoria_desc[language],
        audience: translations.rp_sabedoria_audience[language],
        benefit: translations.rp_sabedoria_benefit[language],
    },
    {
        id: 'desafio_90_dias',
        title: translations.rp_desafio_90_dias_title[language],
        description: translations.rp_desafio_90_dias_desc[language],
        audience: translations.rp_desafio_90_dias_audience[language],
        benefit: translations.rp_desafio_90_dias_benefit[language],
    },
    {
        id: 'vida_cristo_evangelhos',
        title: translations.rp_vida_cristo_evangelhos_title[language],
        description: translations.rp_vida_cristo_evangelhos_desc[language],
        audience: translations.rp_vida_cristo_evangelhos_audience[language],
        benefit: translations.rp_vida_cristo_evangelhos_benefit[language],
    }
];

// Helper functions to generate checklists dynamically based on language
const getStandardBookChecklist = (language: Language) => [
    { testament: translations.old_testament[language], emoji: '📘', items: getBookList('ot', language).map(book => ({ id: book, text: book })) },
    { testament: translations.new_testament[language], emoji: '📗', items: getBookList('nt', language).map(book => ({ id: book, text: book })) }
];

const getProphetsPlanChecklist = (language: Language) => [
    { testament: 'Profetas Maiores', emoji: '📜', items: getBookList('major_prophets', language).map(book => ({ id: book, text: book })) },
    { testament: 'Profetas Menores', emoji: '📜', items: getBookList('minor_prophets', language).map(book => ({ id: book, text: book })) }
];

const getWisdomPlanChecklist = (language: Language) => getBookList('wisdom', language).map(book => ({ id: book, text: book }));
const getGospelsPlanChecklist = (language: Language) => getBookList('gospels', language).map(book => ({ id: book, text: book }));
const getApocryphaPlanChecklist = (language: Language) => getBookList('ap', language).map(book => ({ id: book, text: book }));

const lectioDivinaChecklist = [
    { id: 'lectio_leitura', text: '1. Leitura (Lectio): Ler a passagem lentamente.' },
    { id: 'lectio_meditacao', text: '2. Meditação (Meditatio): Refletir sobre uma palavra ou frase.' },
    { id: 'lectio_oracao', text: '3. Oração (Oratio): Conversar com Deus sobre a passagem.' },
    { id: 'lectio_contemplacao', text: '4. Contemplação (Contemplatio): Apenas descansar na presença de Deus.' }
];

export const thematicPlan77Data = thematicReadingData.map((item, index) => ({
  id: `tema_${index + 1}`,
  text: item.theme,
  references: item.references,
}));

const gospelHarmonyPlanChecklist = gospelHarmonyData.map((item, index) => ({ id: `harmony_${index}`, text: item.evento }));
const archaeologyPlanChecklist = archaeologyData.flatMap((category) => category.items.map((item, index) => ({ id: `arch_${category.category.replace(/\s/g, "")}_${index}`, text: item.title, category: category.category, })));

export const dynamicPlanDefinitions: { [key: string]: ReadingPlan } = {
    gospelHarmony: { id: 'harmonia_evangelhos', title: 'Harmonia dos Evangelhos', description: 'Estudo cronológico da vida de Cristo, comparando os quatro evangelhos evento por evento.', benefit: 'Visão completa e integrada da narrativa do evangelho.', audience: 'Todos os níveis de leitores.' },
    themes: { id: 'tematico_77', title: 'Leitura por Temas', description: 'Um plano de 77 leituras devocionais para diversas situações da vida, cobrindo temas como gratidão, ansiedade, perdão e esperança.', benefit: 'Oferece conforto e sabedoria direcionada.', audience: 'Qualquer pessoa que busca orientação bíblica.' },
    apocrypha: { id: 'apocrifos', title: 'Leitura dos Apócrifos', description: 'Um plano de estudo para explorar os livros apócrifos e outros textos antigos.', benefit: 'Amplia o conhecimento do contexto histórico e literário do período intertestamentário.', audience: 'Estudantes avançados e curiosos.' },
    archaeology: { id: 'arqueologia', title: 'Estudo de Arqueologia', description: 'Plano para explorar as principais descobertas arqueológicas que se conectam com as narrativas bíblicas.', benefit: 'Fortalece a compreensão do contexto histórico e cultural das Escrituras.', audience: 'Entusiastas de história e apologética.' }
};

export const getPlanDetails = (plan: MyReadingPlan, language: Language) => {
    if (plan.id.startsWith('book_')) {
        const canonicalBookName = plan.id.substring(5).replace(/_/g, ' ');
        const translatedBookName = getBookName(canonicalBookName, language);
        const chapterCount = getChapterCount(canonicalBookName);
        if (chapterCount) {
            const checklist = Array.from({ length: chapterCount }, (_, i) => ({
                id: `${canonicalBookName}_${i + 1}`,
                text: `${translations.chapter[language]} ${i + 1}`,
                category: translatedBookName
            }));
            return { type: 'categorized' as const, checklist };
        }
    }
    
    if (plan.id.startsWith('theme_') && plan.data?.references) {
        const checklist = plan.data.references.map((ref: string) => ({
            id: ref,
            text: ref,
            category: 'Referências'
        }));
        return { type: 'categorized' as const, checklist };
    }

    switch (plan.id) {
        case 'anual_tradicional':
        case 'mista':
        case 'mcheyne':
        case 'ritmo_iniciante':
            const standardChecklist = getStandardBookChecklist(language);
            return { type: 'book-based' as const, checklist: standardChecklist, flatChecklist: standardChecklist.flatMap(t => t.items) };
        case 'profetas':
            const prophetsChecklist = getProphetsPlanChecklist(language);
            return { type: 'book-based' as const, checklist: prophetsChecklist, flatChecklist: prophetsChecklist.flatMap(p => p.items) };
        case 'sabedoria':
            return { type: 'simple' as const, checklist: getWisdomPlanChecklist(language) };
        case 'desafio_90_dias':
            const ntChecklist = [{ testament: translations.new_testament[language], emoji: '📗', items: getBookList('nt', language).map(book => ({ id: book, text: book })) }];
            return { type: 'book-based' as const, checklist: ntChecklist, flatChecklist: ntChecklist.flatMap(t => t.items) };
        case 'vida_cristo_evangelhos':
            return { type: 'simple' as const, checklist: getGospelsPlanChecklist(language) };
        case 'lectio_divina':
            return { type: 'simple' as const, checklist: lectioDivinaChecklist };
        case 'tematico_77':
            return { type: 'thematic' as const, checklist: thematicPlan77Data };
        case 'harmonia_evangelhos':
            return { type: 'simple' as const, checklist: gospelHarmonyPlanChecklist };
        case 'apocrifos':
            return { type: 'simple' as const, checklist: getApocryphaPlanChecklist(language) };
        case 'arqueologia':
            return { type: 'categorized' as const, checklist: archaeologyPlanChecklist };
        default:
             // Fallback for custom AI plans which don't have predefined checklists
            if (plan.id.startsWith('custom-ai-')) {
                return null;
            }
            return null;
    }
};