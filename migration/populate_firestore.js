
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// --- Configuração ---
// Chave de serviço para autenticação.
const serviceAccount = require('./serviceAccountKey.json');

// Arquivo JSON com os dados da Bíblia.
const BIBLE_JSON_FILE = '../functions/biblia_kjv_final.json';

// Coleção principal no Firestore.
const BIBLE_COLLECTION = 'bible_chapters'; // Novo nome de coleção para evitar conflitos

// --- Inicialização do Firebase ---
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({ timeout: 120000 }); // Aumenta o timeout para 2 minutos

const bibleDataPath = path.resolve(__dirname, BIBLE_JSON_FILE);
const bibleData = JSON.parse(fs.readFileSync(bibleDataPath, 'utf8'));

// --- Lógica de Migração ---
async function migrateBibleData() {
  console.log('Iniciando a migração dos dados da Bíblia para o Firestore (por capítulos)...');

  // Usar transações em lotes (batch) é muito mais eficiente.
  const batchSize = 50; // Lotes bem menores para evitar timeout
  let batch = db.batch();
  let operationCount = 0;
  let totalChapters = 0;

  for (const lang in bibleData) {
    for (const ver in bibleData[lang]) {
      const books = bibleData[lang][ver];
      for (const bookName in books) {
        const bookData = books[bookName];
        console.log(`Processando livro: ${bookName}`);

        for (const chapterNum in bookData) {
          totalChapters++;
          const verses = bookData[chapterNum];

          // Define um ID de documento único para cada capítulo. Ex: "pt_kjv_Genesis_1"
          const chapterDocId = `${lang}_${ver}_${bookName}_${chapterNum}`;
          const chapterDocRef = db.collection(BIBLE_COLLECTION).doc(chapterDocId);

          // Prepara a escrita do capítulo no lote
          batch.set(chapterDocRef, {
              book: bookName,
              chapter: parseInt(chapterNum, 10),
              language: lang,
              version: ver,
              verses: verses
          });

          operationCount++;

          // Quando o lote atinge o tamanho máximo, ele é "commitado" (enviado).
          if (operationCount >= batchSize) {
            console.log(`   -> Enviando lote de ${operationCount} capítulos para o Firestore...`);
            await batch.commit();
            // Reinicia o lote para as próximas operações.
            batch = db.batch();
            operationCount = 0;
          }
        }
      }
    }
  }

  // Envia qualquer operação restante no último lote.
  if (operationCount > 0) {
    console.log(`   -> Enviando o último lote de ${operationCount} capítulos para o Firestore...`);
    await batch.commit();
  }

  console.log(`
Migração concluída com sucesso!`);
  console.log(`Total de ${totalChapters} capítulos migrados para a coleção '${BIBLE_COLLECTION}'.`);
}

migrateBibleData().catch(error => {
  console.error('Ocorreu um erro grave durante a migração:', error);
});
