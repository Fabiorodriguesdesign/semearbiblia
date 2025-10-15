const functions = require('firebase-functions');
const fetch = require('node-fetch');
const cors = require('cors')({origin: true});

exports.getVerseProxy = functions.https.onRequest(async (req, res) => {
  const lang = req.query.lang || 'pt';
  try {
    const response = await fetch(`https://bible-api.com/?random=verse&language=${lang}`);
    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching verse');
  }
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- COPIE E COLE ESTA FUNÇÃO INTEIRA ---

exports.generateReflectionProxy = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // --- MUDANÇA AQUI ---
      // Pega a API Key da configuração de ambiente do Firebase, em vez do Secret Manager.
      const gemini_api_key = functions.config().gemini.key;
      // --- FIM DA MUDANÇA ---

      if (!gemini_api_key) {
        throw new functions.https.HttpsError('internal', 'A chave da API do Gemini não está configurada no servidor.');
      }

      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const ai = new GoogleGenerativeAI(gemini_api_key);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const { verseText, bookName, chapter, verseNum, lang } = req.body.data;

      const langInstruction = lang === 'pt' ? "em português brasileiro" : lang === 'es' ? "en español" : "in English";
      const prompt = `Aja como um assistente bíblico. O usuário receberá um versículo do dia. Sua tarefa é escrever uma reflexão curta, inspiradora e de fácil compreensão sobre o versículo. A reflexão deve ser encorajadora e relevante para o dia a dia. Não inclua a referência do versículo na sua resposta, apenas a reflexão. O versículo é: \"${bookName} ${chapter}:${verseNum} - ${verseText}\". Responda ${langInstruction}.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const reflectionText = response.text();

      res.json({ data: { reflection: reflectionText } });

    } catch (error) {
      console.error("Erro na Cloud Function generateReflectionProxy:", error);
      res.status(500).send({ error: 'Falha ao gerar a reflexão.' });
    }
  });
});
