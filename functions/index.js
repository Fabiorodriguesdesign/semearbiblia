const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

admin.initializeApp();

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
};

exports.getBibleData = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      return;
  }

  const biblePath = path.join(__dirname, 'bible');
  const bibleData = {};
  const version = 'kjv';

  try {
    const languages = fs.readdirSync(biblePath);
    for (const lang of languages) {
      if (!bibleData[lang]) {
        bibleData[lang] = {};
        bibleData[lang][version] = {}
      }
      const testamentPaths = [path.join(biblePath, lang, "New_Testament"), path.join(biblePath, lang, "Old_Testament")];
      for (const testamentPath of testamentPaths) {
          if (!fs.existsSync(testamentPath)) continue;
          const books = fs.readdirSync(testamentPath);
          for (const book of books) {
              const bookPath = path.join(testamentPath, book);
              if (!bibleData[lang][version][book]){
                bibleData[lang][version][book] = {};
              }
              const chapters = fs.readdirSync(bookPath);
              for (const chapterFile of chapters) {
                  const chapterPath = path.join(bookPath, chapterFile);
                  const chapterContent = fs.readFileSync(chapterPath, 'utf8');
                  const chapterData = JSON.parse(chapterContent);
                  const chapterNum = chapterData.chapter;
                  if (!bibleData[lang][version][book][chapterNum]){
                    bibleData[lang][version][book][chapterNum] = {};
                  }
                  bibleData[lang][version][book][chapterNum] = chapterData.verses;
              }
          }
      }
    }

    res.set("Content-Type", "application/json");
    res.status(200).send(bibleData);
  } catch (err) {
    console.error("Error reading bible files:", err);
    res.status(500).send("Error reading bible files");
  }
});

exports.getVerseOfTheDay = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }

    const lang = req.query.lang || 'pt';
    const validLangs = ['pt', 'en', 'es'];
    const requestedLang = validLangs.includes(lang) ? lang : 'pt';
    const filePath = path.join(__dirname, `notifications_${requestedLang}.json`);

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