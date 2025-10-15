import { GoogleGenerativeAI } from "@google/generative-ai";

// Rota da API para gerar reflexões
export default async (req, res) => {
  // 1. VERIFICAÇÃO DE SEGURANÇA: Checa se a chave da API existe
  if (!process.env.GEMINI_API_KEY_SEMEARB) {
    console.error("Erro Crítico: A variável de ambiente GEMINI_API_KEY_SEMEARB não está configurada.");
    return res.status(500).json({ 
      message: "Erro de configuração do servidor: a chave da API de IA não foi encontrada.",
      error_code: "API_KEY_MISSING"
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { verseText, bookName, chapter, verseNum, lang } = req.body;

  // Acessa a API Key da variável de ambiente da Vercel
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_SEMEARB);
  
  const langMap = {
    pt: 'português do Brasil',
    en: 'American English',
    es: 'Español'
  };
  const currentLang = langMap[lang] || 'português do Brasil';

  // Configura o modelo com a instrução do sistema
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `Você é um pastor e teólogo com profundo conhecimento bíblico. Sua tarefa é criar uma breve reflexão (de 2 a 4 frases) sobre o versículo fornecido. A reflexão deve ser pastoral, devocional, profunda e aplicável à vida diária. Responda no idioma: ${currentLang}.`
  });

  const prompt = `Gere uma reflexão sobre o versículo: "${verseText}" (${bookName} ${chapter}:${verseNum}).`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reflection = response.text();
    res.status(200).json({ reflection });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ 
      message: "Falha ao gerar a reflexão a partir da IA.",
      error_code: "GEMINI_API_ERROR"
    });
  }
};
