import { Language, VerseOfTheDay } from '../types';
import { getCanonicalBookList, getBookName, getBookDetails } from '../data/bibleBooks';

const bookCache = new Map<string, any>();

const fetchBookData = async (bookCanonicalName: string, lang: Language): Promise<any> => {
    const details = getBookDetails(bookCanonicalName);
    if (!details) {
        console.error(`Detalhes do arquivo não encontrados para: ${bookCanonicalName}`);
        return null;
    }
    
    // SOLUÇÃO TEMPORÁRIA: Força o uso dos dados em inglês para a seleção 'pt'
    // Isso previne crashes enquanto os arquivos de tradução para o português não estão prontos.
    const effectiveLang = (lang === 'pt') ? 'en' : lang;
    const langFolder = { pt: 'portugues', en: 'english', es: 'espanol' }[effectiveLang];

    if (!langFolder) {
        console.error(`Língua não suportada: ${lang}`);
        return null;
    }
    const testamentFolder = details.testament === 'ot' ? 'Old_Testament' : 'New_Testament';
    const fileName = details.files[Math.floor(Math.random() * details.files.length)];
    const filePath = `/bible/${langFolder}/${testamentFolder}/${details.folder}/${fileName}`;

    if (bookCache.has(filePath)) {
        return bookCache.get(filePath);
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            console.error(`Falha ao buscar o livro: ${response.status} ${filePath}`);
            return null;
        }
        const data = await response.json();
        bookCache.set(filePath, data);
        return data;
    } catch (error) {
        console.error(`Erro ao carregar o JSON do livro: ${filePath}`, error);
        return null;
    }
};

const generateReflection = async (verseText: string, bookName: string, chapter: number, verseNum: number, lang: Language): Promise<string> => {
    try {
        const response = await fetch('/api/generateReflection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ verseText, bookName, chapter, verseNum, lang })
        });

        if (!response.ok) {
            const errorBody = await response.json(); 
            console.error("Erro na resposta da API:", response.status, errorBody);
            return errorBody.message || `A API de reflexão falhou com status ${response.status}`;
        }

        const result = await response.json();
        return result.reflection;

    } catch (error) {
        console.error("Erro ao chamar a API de reflexão:", error);
        const fallbackMessages = {
            pt: "Que este versículo inspire o seu dia.",
            en: "May this verse inspire your day.",
            es: "Que este versículo inspire tu día."
        };
        return fallbackMessages[lang];
    }
};

export const getDynamicVerseOfTheDay = async (lang: Language): Promise<VerseOfTheDay | null> => {
    const MAX_ATTEMPTS = 50; 
    const canonicalBooks = getCanonicalBookList('all_canon');

    if (!canonicalBooks || canonicalBooks.length === 0) {
        console.error("Lista de livros canônicos não encontrada.");
        return null;
    }

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        try {
            const randomBookCanonicalName = canonicalBooks[Math.floor(Math.random() * canonicalBooks.length)];
            
            // Usa a lingua efetiva para buscar os dados, mas a original para o nome do livro
            const effectiveLang = (lang === 'pt') ? 'en' : lang;
            const bookData = await fetchBookData(randomBookCanonicalName, effectiveLang);

            if (!bookData || typeof bookData !== 'object') continue;

            // A CHAVE DO LIVRO DENTRO DO JSON ESTARÁ EM INGLÊS (ex: "Genesis")
            // Precisamos pegar a primeira (e única) chave do objeto, seja ela qual for.
            const bookKey = Object.keys(bookData)[0];
            if (!bookKey || !bookData[bookKey] || typeof bookData[bookKey] !== 'object') continue;
            const chapters = bookData[bookKey];

            const chapterKeys = Object.keys(chapters).filter(key => !isNaN(parseInt(key)));
            if (chapterKeys.length === 0) continue;
            
            const randomChapterKey = chapterKeys[Math.floor(Math.random() * chapterKeys.length)];
            const chapterData = chapters[randomChapterKey];

            if (!chapterData || typeof chapterData !== 'object') continue;

            const verseKeys = Object.keys(chapterData).filter(key => !isNaN(parseInt(key)));
            if (verseKeys.length === 0) continue;

            const randomVerseKey = verseKeys[Math.floor(Math.random() * verseKeys.length)];
            const verseText = chapterData[randomVerseKey];

            if (typeof verseText !== 'string' || verseText.trim() === '') continue;
            
            // Usa a LÍNGUA ORIGINAL para obter o nome traduzido para a UI
            const localizedBookName = getBookName(randomBookCanonicalName, lang);

            if (typeof localizedBookName !== 'string') {
                console.error("BUG PREVENIDO: getBookName() não retornou uma string.", { input: randomBookCanonicalName, output: localizedBookName });
                continue;
            }

            const reflection = await generateReflection(verseText, localizedBookName, parseInt(randomChapterKey), parseInt(randomVerseKey), lang);
            
            return {
                book: localizedBookName,
                chapter: parseInt(randomChapterKey),
                verse: parseInt(randomVerseKey),
                text: verseText,
                reflection: reflection
            };

        } catch (error) {
            console.error(`Erro na tentativa ${i + 1} de buscar versículo:`, error);
            continue;
        }
    }

    console.error("NÃO FOI POSSÍVEL OBTER UM VERSÍCULO VÁLIDO APÓS MÚLTIPLAS TENTATIVAS.");
    return null;
};