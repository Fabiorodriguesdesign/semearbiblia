
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');
const BIBLE_JSON_FILE = '../functions/biblia_kjv_final.json';
const BIBLE_COLLECTION = 'bible_chapters';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bibleDataPath = path.resolve(__dirname, BIBLE_JSON_FILE);
const bibleData = JSON.parse(fs.readFileSync(bibleDataPath, 'utf8'));

async function createSkeletons() {
  console.log('Fase 1: Iniciando a criação da estrutura de capítulos (esqueletos)...');

  const batchSize = 450; 
  let batch = db.batch();
  let operationCount = 0;
  let totalChapters = 0;

  for (const lang in bibleData) {
    for (const ver in bibleData[lang]) {
      const books = bibleData[lang][ver];
      for (const bookName in books) {
        const bookData = books[bookName];
        console.log(` -> Preparando livro: ${bookName}`);

        for (const chapterNum in bookData) {
          totalChapters++;
          
          const chapterDocId = `${lang}_${ver}_${bookName}_${chapterNum}`;
          const chapterDocRef = db.collection(BIBLE_COLLECTION).doc(chapterDocId);
          
          batch.set(chapterDocRef, {
              book: bookName,
              chapter: parseInt(chapterNum, 10),
              language: lang,
              version: ver,
              // Verses não são incluídos nesta fase
          });

          operationCount++;

          if (operationCount >= batchSize) {
            console.log(`   -> Enviando lote de ${operationCount} esqueletos para o Firestore...`);
            await batch.commit();
            batch = db.batch();
            operationCount = 0;
          }
        }
      }
    }
  }

  if (operationCount > 0) {
    console.log(`   -> Enviando o último lote de ${operationCount} esqueletos para o Firestore...`);
    await batch.commit();
  }

  console.log('\nFase 1 concluída com sucesso!');
  console.log(`Total de ${totalChapters} documentos de capítulo criados na coleção '${BIBLE_COLLECTION}'.`);
}

createSkeletons().catch(error => {
  console.error('Ocorreu um erro na Fase 1:', error);
});
