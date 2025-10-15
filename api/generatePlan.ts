import { GoogleGenerativeAI, Type } from "@google/generative-ai";

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { version, time, frequency, goal, preference, language } = req.body;

  // Acessa a API Key da variável de ambiente da Vercel
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_SEMEARB);

  const langMap = { pt: 'português do Brasil', en: 'American English', es: 'Español' };
  const currentLang = langMap[language] || 'português do Brasil';

  // Configura o modelo com a instrução do sistema e o schema de resposta
  const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are a wise and empathetic Bible study assistant. Your goal is to create personalized, encouraging, and practical Bible reading plans. The response MUST be a valid JSON object that adheres to the provided schema. The response language must be ${currentLang}.`,
  });

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
    // Geração de conteúdo com schema
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });
    
    const response = await result.response;
    res.status(200).json(JSON.parse(response.text()));
  } catch (error) {
    console.error("Error generating plan with AI:", error);
    res.status(500).json({ message: "Error generating plan." });
  }
};
