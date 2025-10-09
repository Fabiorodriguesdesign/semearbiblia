
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// --- Configuração ---
const serviceAccount = require('./serviceAccountKey.json');
const BIBLE_JSON_FILE = '../functions/biblia_kjv_final.json';
const BIBLE_COLLECTION = 'bible_chapters';

// --- Inicialização do Firebase ---
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (e) {
  // Evita erro de reinicialização se o script for executado várias vezes
  if (e.code !== 'app/duplicate-app') {
    throw e;
  }
}

const db = admin.firestore();
const bibleDataPath = path.resolve(__dirname, BIBLE_JSON_FILE);
const bibleData = JSON.parse(fs.readFileSync(bibleDataPath, 'utf8'));

// --- Lógica de Migração (Um por Um) ---
async function migrateSlowAndSteady() {
  console.log('Iniciando a migração final (um capítulo por vez) para máxima estabilidade...');

  let totalChapters = 0;
  let successfullyMigrated = 0;

  for (const lang in bibleData) {
    for (const ver in bibleData[lang]) {
      const books = bibleData[lang][ver];
      for (const bookName in books) {
        const bookData = books[bookName];
        console.log(`Processando livro: ${bookName}`);

        for (const chapterNum in bookData) {
          totalChapters++;
          const verses = bookData[chapterNum];
          
          const chapterDocId = `${lang}_${ver}_${bookName}_${chapterNum}`;
          const chapterDocRef = db.collection(BIBLE_COLLECTION).doc(chapterDocId);
          
          try {
            // Realiza a escrita de um único capítulo e espera a conclusão.
            await chapterDocRef.set({
                book: bookName,
                chapter: parseInt(chapterNum, 10),
                language: lang,
                version: ver,
                verses: verses
            });
            successfullyMigrated++;
            console.log(`  -> Sucesso ao salvar: ${bookName} ${chapterNum}`);
          } catch (error) {
            console.error(`  -> ERRO ao salvar capítulo: ${bookName} ${chapterNum}. Tentando novamente em 5s...`);
            // Lógica de nova tentativa
            try {
              await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos
              await chapterDocRef.set({
                book: bookName,
                chapter: parseInt(chapterNum, 10),
                language: lang,
                version: ver,
                verses: verses
              });
              successfullyMigrated++;
              console.log(`  -> Sucesso na nova tentativa: ${bookName} ${chapterNum}`);
            } catch (retryError) {
               console.error(`  -> FALHA DEFINITIVA para ${bookName} ${chapterNum}. Pulando este capítulo.`);
            }
          }
        }
      }
    }
  }

  console.log(`\nMigração concluída!`);
  console.log(`${successfullyMigrated} de ${totalChapters} capítulos processados com sucesso.`);
}

migrateSlowAndSteady().catch(error => {
  console.error('Ocorreu um erro fatal e inesperado durante a migração:', error);
});
