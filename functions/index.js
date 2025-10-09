const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require("fs");

admin.initializeApp();

// Aumenta os recursos da função para lidar com arquivos grandes
const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
};

exports.getBibleData = functions.runWith(runtimeOpts).https.onRequest((req, res) => {
  const filePath = "./biblia_kjv_final.json";
  const readStream = fs.createReadStream(filePath);

  // Define o cabeçalho para JSON
  res.set("Content-Type", "application/json");

  // Inicia o streaming do arquivo para a resposta
  readStream.on('open', () => {
    readStream.pipe(res);
  });

  // Trata erros durante o streaming
  readStream.on('error', (err) => {
    console.error("Error streaming file:", err);
    res.status(500).send("Error reading or streaming file");
  });
});

exports.getVerseOfTheDay = functions.https.onRequest((req, res) => {
    // Permite solicitações de qualquer origem (necessário para o navegador)
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Lida com solicitações de preflight do CORS
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }

    const lang = req.query.lang || 'pt';
    const validLangs = ['pt', 'en', 'es'];
    const requestedLang = validLangs.includes(lang) ? lang : 'pt';
    const filePath = `./notifications_${requestedLang}.json`;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            res.status(500).send("Error reading verse of the day file.");
        } else {
            res.set("Content-Type", "application/json");
            res.status(200).send(data);
        }
    });
});
