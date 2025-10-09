import { Language } from '../types';
import { normalizeString } from '../utils/utils';

type BookDetails = {
    chapters: number;
    names: { [lang in Language]: string };
};

const bibleBookData: { [canonicalName: string]: BookDetails } = {
    // Old Testament
    'Genesis': { chapters: 50, names: { pt: 'Gênesis', en: 'Genesis', es: 'Génesis' } },
    'Exodus': { chapters: 40, names: { pt: 'Êxodo', en: 'Exodus', es: 'Éxodo' } },
    'Leviticus': { chapters: 27, names: { pt: 'Levítico', en: 'Leviticus', es: 'Levítico' } },
    'Numbers': { chapters: 36, names: { pt: 'Números', en: 'Numbers', es: 'Números' } },
    'Deuteronomy': { chapters: 34, names: { pt: 'Deuteronômio', en: 'Deuteronomy', es: 'Deuteronomio' } },
    'Joshua': { chapters: 24, names: { pt: 'Josué', en: 'Joshua', es: 'Josué' } },
    'Judges': { chapters: 21, names: { pt: 'Juízes', en: 'Judges', es: 'Jueces' } },
    'Ruth': { chapters: 4, names: { pt: 'Rute', en: 'Ruth', es: 'Rut' } },
    '1 Samuel': { chapters: 31, names: { pt: '1 Samuel', en: '1 Samuel', es: '1 Samuel' } },
    '2 Samuel': { chapters: 24, names: { pt: '2 Samuel', en: '2 Samuel', es: '2 Samuel' } },
    '1 Kings': { chapters: 22, names: { pt: '1 Reis', en: '1 Kings', es: '1 Reyes' } },
    '2 Kings': { chapters: 25, names: { pt: '2 Reis', en: '2 Kings', es: '2 Reyes' } },
    '1 Chronicles': { chapters: 29, names: { pt: '1 Crônicas', en: '1 Chronicles', es: '1 Crónicas' } },
    '2 Chronicles': { chapters: 36, names: { pt: '2 Crônicas', en: '2 Chronicles', es: '2 Crónicas' } },
    'Ezra': { chapters: 10, names: { pt: 'Esdras', en: 'Ezra', es: 'Esdras' } },
    'Nehemiah': { chapters: 13, names: { pt: 'Neemias', en: 'Nehemiah', es: 'Nehemías' } },
    'Esther': { chapters: 10, names: { pt: 'Ester', en: 'Esther', es: 'Ester' } },
    'Job': { chapters: 42, names: { pt: 'Jó', en: 'Job', es: 'Job' } },
    'Psalms': { chapters: 150, names: { pt: 'Salmos', en: 'Psalms', es: 'Salmos' } },
    'Proverbs': { chapters: 31, names: { pt: 'Provérbios', en: 'Proverbs', es: 'Proverbios' } },
    'Ecclesiastes': { chapters: 12, names: { pt: 'Eclesiastes', en: 'Ecclesiastes', es: 'Eclesiastés' } },
    'Song of Solomon': { chapters: 8, names: { pt: 'Cânticos', en: 'Song of Solomon', es: 'Cantares' } },
    'Isaiah': { chapters: 66, names: { pt: 'Isaías', en: 'Isaiah', es: 'Isaías' } },
    'Jeremiah': { chapters: 52, names: { pt: 'Jeremias', en: 'Jeremiah', es: 'Jeremías' } },
    'Lamentations': { chapters: 5, names: { pt: 'Lamentações', en: 'Lamentations', es: 'Lamentaciones' } },
    'Ezekiel': { chapters: 48, names: { pt: 'Ezequiel', en: 'Ezekiel', es: 'Ezequiel' } },
    'Daniel': { chapters: 12, names: { pt: 'Daniel', en: 'Daniel', es: 'Daniel' } },
    'Hosea': { chapters: 14, names: { pt: 'Oseias', en: 'Hosea', es: 'Oseas' } },
    'Joel': { chapters: 3, names: { pt: 'Joel', en: 'Joel', es: 'Joel' } },
    'Amos': { chapters: 9, names: { pt: 'Amós', en: 'Amos', es: 'Amós' } },
    'Obadiah': { chapters: 1, names: { pt: 'Obadias', en: 'Obadiah', es: 'Abdías' } },
    'Jonah': { chapters: 4, names: { pt: 'Jonas', en: 'Jonah', es: 'Jonás' } },
    'Micah': { chapters: 7, names: { pt: 'Miqueias', en: 'Micah', es: 'Miqueas' } },
    'Nahum': { chapters: 3, names: { pt: 'Naum', en: 'Nahum', es: 'Nahúm' } },
    'Habakkuk': { chapters: 3, names: { pt: 'Habacuque', en: 'Habakkuk', es: 'Habacuc' } },
    'Zephaniah': { chapters: 3, names: { pt: 'Sofonias', en: 'Zephaniah', es: 'Sofonías' } },
    'Haggai': { chapters: 2, names: { pt: 'Ageu', en: 'Haggai', es: 'Hageo' } },
    'Zechariah': { chapters: 14, names: { pt: 'Zacarias', en: 'Zechariah', es: 'Zacarías' } },
    'Malachi': { chapters: 4, names: { pt: 'Malaquias', en: 'Malachi', es: 'Malaquías' } },
    // New Testament
    'Matthew': { chapters: 28, names: { pt: 'Mateus', en: 'Matthew', es: 'Mateo' } },
    'Mark': { chapters: 16, names: { pt: 'Marcos', en: 'Mark', es: 'Marcos' } },
    'Luke': { chapters: 24, names: { pt: 'Lucas', en: 'Luke', es: 'Lucas' } },
    'John': { chapters: 21, names: { pt: 'João', en: 'John', es: 'Juan' } },
    'Acts': { chapters: 28, names: { pt: 'Atos', en: 'Acts', es: 'Hechos' } },
    'Romans': { chapters: 16, names: { pt: 'Romanos', en: 'Romans', es: 'Romanos' } },
    '1 Corinthians': { chapters: 16, names: { pt: '1 Coríntios', en: '1 Corinthians', es: '1 Corintios' } },
    '2 Corinthians': { chapters: 13, names: { pt: '2 Coríntios', en: '2 Corinthians', es: '2 Corintios' } },
    'Galatians': { chapters: 6, names: { pt: 'Gálatas', en: 'Galatians', es: 'Gálatas' } },
    'Ephesians': { chapters: 6, names: { pt: 'Efésios', en: 'Ephesians', es: 'Efesios' } },
    'Philippians': { chapters: 4, names: { pt: 'Filipenses', en: 'Philippians', es: 'Filipenses' } },
    'Colossians': { chapters: 4, names: { pt: 'Colossenses', en: 'Colossians', es: 'Colosenses' } },
    '1 Thessalonians': { chapters: 5, names: { pt: '1 Tessalonicenses', en: '1 Thessalonians', es: '1 Tesalonicenses' } },
    '2 Thessalonians': { chapters: 3, names: { pt: '2 Tessalonicenses', en: '2 Thessalonians', es: '2 Tesalonicenses' } },
    '1 Timothy': { chapters: 6, names: { pt: '1 Timóteo', en: '1 Timothy', es: '1 Timoteo' } },
    '2 Timothy': { chapters: 4, names: { pt: '2 Timóteo', en: '2 Timothy', es: '2 Timoteo' } },
    'Titus': { chapters: 3, names: { pt: 'Tito', en: 'Titus', es: 'Tito' } },
    'Philemon': { chapters: 1, names: { pt: 'Filemom', en: 'Philemon', es: 'Filemón' } },
    'Hebrews': { chapters: 13, names: { pt: 'Hebreus', en: 'Hebrews', es: 'Hebreos' } },
    'James': { chapters: 5, names: { pt: 'Tiago', en: 'James', es: 'Santiago' } },
    '1 Peter': { chapters: 5, names: { pt: '1 Pedro', en: '1 Peter', es: '1 Pedro' } },
    '2 Peter': { chapters: 3, names: { pt: '2 Pedro', en: '2 Peter', es: '2 Pedro' } },
    '1 John': { chapters: 5, names: { pt: '1 João', en: '1 John', es: '1 Juan' } },
    '2 John': { chapters: 1, names: { pt: '2 João', en: '2 John', es: '2 Juan' } },
    '3 John': { chapters: 1, names: { pt: '3 João', en: '3 John', es: '3 Juan' } },
    'Jude': { chapters: 1, names: { pt: 'Judas', en: 'Jude', es: 'Judas' } },
    'Revelation': { chapters: 22, names: { pt: 'Apocalipse', en: 'Revelation', es: 'Apocalipsis' } },
    // Deuterocanonical
    'Tobit': { chapters: 14, names: { pt: 'Tobias', en: 'Tobit', es: 'Tobías' } },
    'Judith': { chapters: 16, names: { pt: 'Judite', en: 'Judith', es: 'Judit' } },
    'Wisdom of Solomon': { chapters: 19, names: { pt: 'Sabedoria de Salomão', en: 'Wisdom of Solomon', es: 'Sabiduría' } },
    'Sirach': { chapters: 51, names: { pt: 'Eclesiástico (Sirácida)', en: 'Sirach', es: 'Eclesiástico (Sirácida)' } },
    'Baruch': { chapters: 6, names: { pt: 'Baruque', en: 'Baruch', es: 'Baruc' } },
    '1 Maccabees': { chapters: 16, names: { pt: '1 Macabeus', en: '1 Maccabees', es: '1 Macabeos' } },
    '2 Maccabees': { chapters: 15, names: { pt: '2 Macabeus', en: '2 Maccabees', es: '2 Macabeos' } },
    'Additions to Esther': { chapters: 1, names: { pt: 'Adições a Ester', en: 'Additions to Esther', es: 'Añadiduras a Ester' } },
    'Additions to Daniel': { chapters: 1, names: { pt: 'Adições a Daniel', en: 'Additions to Daniel', es: 'Añadiduras a Daniel' } },
    // Apocryphal
    '1 Esdras': { chapters: 9, names: { pt: '1 Esdras', en: '1 Esdras', es: '1 Esdras' } },
    '2 Esdras': { chapters: 16, names: { pt: '2 Esdras', en: '2 Esdras', es: '2 Esdras' } },
    '3 Maccabees': { chapters: 7, names: { pt: '3 Macabeus', en: '3 Maccabees', es: '3 Macabeos' } },
    '4 Maccabees': { chapters: 18, names: { pt: '4 Macabeus', en: '4 Maccabees', es: '4 Macabeos' } },
    'Psalm 151': { chapters: 1, names: { pt: 'Salmo 151', en: 'Psalm 151', es: 'Salmo 151' } },
    'Book of Enoch': { chapters: 108, names: { pt: 'Livro de Enoque', en: 'Book of Enoch', es: 'Libro de Enoc' } },
    'Book of Jubilees': { chapters: 50, names: { pt: 'Livro dos Jubileus', en: 'Book of Jubilees', es: 'Libro de los Jubileos' } },
    'Testament of the Twelve Patriarchs': { chapters: 1, names: { pt: 'Testamento dos Doze Patriarcas', en: 'Testament of the Twelve Patriarchs', es: 'Testamento de los Doce Patriarcas' } },
    'Apocalypse of Baruch': { chapters: 87, names: { pt: 'Apocalipse de Baruc', en: 'Apocalypse of Baruch', es: 'Apocalipsis de Baruc' } },
    'Assumption of Moses': { chapters: 12, names: { pt: 'Assunção de Moisés', en: 'Assumption of Moses', es: 'Asunción de Moisés' } },
    'Psalms of Solomon': { chapters: 18, names: { pt: 'Salmos de Salomão', en: 'Psalms of Solomon', es: 'Salmos de Salomón' } },
    'Gospel of Thomas': { chapters: 1, names: { pt: 'Evangelho de Tomé', en: 'Gospel of Thomas', es: 'Evangelio de Tomás' } },
    'Gospel of Peter': { chapters: 1, names: { pt: 'Evangelho de Pedro', en: 'Gospel of Peter', es: 'Evangelio de Pedro' } },
    'Proto-Gospel of James': { chapters: 24, names: { pt: 'Proto-Evangelho de Tiago', en: 'Proto-Gospel of James', es: 'Protoevangelio de Santiago' } },
    'Gospel of Philip': { chapters: 1, names: { pt: 'Evangelho de Filipe', en: 'Gospel of Philip', es: 'Evangelio de Felipe' } },
    'Acts of Peter': { chapters: 1, names: { pt: 'Atos de Pedro', en: 'Acts of Peter', es: 'Hechos de Pedro' } },
};

const CANONICAL_ORDER = {
    ot: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'],
    nt: ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'],
    dc: ['Tobit', 'Judith', 'Wisdom of Solomon', 'Sirach', 'Baruch', '1 Maccabees', '2 Maccabees', 'Additions to Esther', 'Additions to Daniel'],
    ap: ['1 Esdras', '2 Esdras', '3 Maccabees', '4 Maccabees', 'Psalm 151', 'Book of Enoch', 'Book of Jubilees', 'Testament of the Twelve Patriarchs', 'Apocalypse of Baruch', 'Assumption of Moses', 'Psalms of Solomon', 'Gospel of Thomas', 'Gospel of Peter', 'Proto-Gospel of James', 'Gospel of Philip', 'Acts of Peter'],
    major_prophets: ['Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel'],
    minor_prophets: ['Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'],
    wisdom: ['Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon'],
    gospels: ['Matthew', 'Mark', 'Luke', 'John']
};

const pt_abbreviations = {'gn':'Genesis','êx':'Exodus','ex':'Exodus','lv':'Leviticus','nm':'Numbers','dt':'Deuteronomy','js':'Joshua','jz':'Judges','rt':'Ruth','1sm':'1 Samuel','2sm':'2 Samuel','1 sm':'1 Samuel','2 sm':'2 Samuel','1rs':'1 Kings','2rs':'2 Kings','1cr':'1 Chronicles','2cr':'2 Chronicles','1 crôn':'1 Chronicles','2 crôn':'2 Chronicles','ed':'Ezra','ne':'Nehemiah','et':'Esther','jó':'Job','sl':'Psalms','sal':'Psalms','slm':'Psalms','pv':'Proverbs','prov':'Proverbs','ec':'Ecclesiastes','ecles':'Ecclesiastes','ct':'Song of Solomon','cant':'Song of Solomon','is':'Isaiah','isa':'Isaiah','jr':'Jeremiah','jer':'Jeremiah','lm':'Lamentations','ez':'Ezekiel','ezeq':'Ezekiel','dn':'Daniel','dan':'Daniel','os':'Hosea','jl':'Joel','am':'Amos','ob':'Obadiah','jn':'Jonah','jon':'Jonah','mq':'Micah','miq':'Micah','na':'Nahum','hc':'Habakkuk','hab':'Habakkuk','sf':'Zephaniah','sof':'Zephaniah','ag':'Haggai','zc':'Zechariah','zac':'Zechariah','ml':'Malachi','mal':'Malachi','mt':'Matthew','mat':'Matthew','mc':'Mark','mar':'Mark','lc':'Luke','luc':'Luke','jo':'John','joa':'John','at':'Acts','atos':'Acts','rm':'Romans','rom':'Romans','1co':'1 Corinthians','2co':'2 Corinthians','1 cor':'1 Corinthians','2 cor':'2 Corinthians','gl':'Galatians','gal':'Galatians','ef':'Ephesians','efes':'Ephesians','fp':'Philippians','fil':'Philippians','cl':'Colossians','col':'Colossians','1ts':'1 Thessalonians','2ts':'2 Thessalonians','1 tes':'1 Thessalonians','2 tes':'2 Thessalonians','1tm':'1 Timothy','2tm':'2 Timothy','1 tim':'1 Timothy','2 tim':'2 Timothy','tt':'Titus','tit':'Titus','fm':'Philemon','filem':'Philemon','hb':'Hebrews','heb':'Hebrews','tg':'James','tia':'James','1pe':'1 Peter','2pe':'2 Peter','1 ped':'1 Peter','2 ped':'2 Peter','1jo':'1 John','2jo':'2 John','3jo':'3 John','1 joa':'1 John','2 joa':'2 John','3 joa':'3 John','jd':'Jude','jud':'Jude','ap':'Revelation','apoc':'Revelation','gênesis':'Genesis','êxodo':'Exodus','levítico':'Leviticus','números':'Numbers','deuteronômio':'Deuteronomy','josué':'Joshua','juízes':'Judges','rute':'Ruth','1 samuel':'1 Samuel','2 samuel':'2 Samuel','1 reis':'1 Kings','2 reis':'2 Kings','1 crônicas':'1 Chronicles','2 crônicas':'2 Chronicles','esdras':'Ezra','neemias':'Nehemiah','ester':'Esther','salmos':'Psalms','provérbios':'Proverbs','eclesiastes':'Ecclesiastes','cânticos':'Song of Solomon','cantares':'Song of Solomon','isaías':'Isaiah','jeremias':'Jeremiah','lamentações':'Lamentations','ezequiel':'Ezekiel','daniel':'Daniel','oseias':'Hosea','amós':'Amos','obadias':'Obadiah','jonas':'Jonah','miqueias':'Micah','naum':'Nahum','habacuque':'Habakkuk','sofonias':'Zephaniah','ageu':'Haggai','zacarias':'Zechariah','malaquias':'Malachi','mateus':'Matthew','marcos':'Mark','lucas':'Luke','joão':'John','romanos':'Romans','1 coríntios':'1 Corinthians','2 coríntios':'2 Corinthians','gálatas':'Galatians','efésios':'Ephesians','filipenses':'Philippians','colossenses':'Colossians','1 tessalonicenses':'1 Thessalonians','2 tessalonicenses':'2 Thessalonians','1 timóteo':'1 Timothy','2 timóteo':'2 Timothy','tito':'Titus','filemom':'Philemon','hebreus':'Hebrews','tiago':'James','1 pedro':'1 Peter','2 pedro':'2 Peter','1 joão':'1 John','2 joão':'2 John','3 joão':'3 John','judas':'Jude','apocalipse':'Revelation'};
const en_abbreviations = {'gen':'Genesis','gn':'Genesis','exod':'Exodus','ex':'Exodus','lev':'Leviticus','lv':'Leviticus','num':'Numbers','nm':'Numbers','deut':'Deuteronomy','dt':'Deuteronomy','josh':'Joshua','jos':'Joshua','judg':'Judges','jg':'Judges','ruth':'Ruth','ru':'Ruth','1 sam':'1 Samuel','2 sam':'2 Samuel','1sa':'1 Samuel','2sa':'2 Samuel','1 kgs':'1 Kings','2 kgs':'2 Kings','1ki':'1 Kings','2ki':'2 Kings','1 chr':'1 Chronicles','2 chr':'2 Chronicles','1ch':'1 Chronicles','2ch':'2 Chronicles','ezra':'Ezra','ezr':'Ezra','neh':'Nehemiah','ne':'Nehemiah','est':'Esther','es':'Esther','job':'Job','jb':'Job','ps':'Psalms','psa':'Psalms','psalm':'Psalms','prov':'Proverbs','prv':'Proverbs','eccl':'Ecclesiastes','ecc':'Ecclesiastes','song':'Song of Solomon','sos':'Song of Solomon','isa':'Isaiah','is':'Isaiah','jer':'Jeremiah','je':'Jeremiah','lam':'Lamentations','la':'Lamentations','ezek':'Ezekiel','eze':'Ezekiel','dan':'Daniel','dn':'Daniel','hos':'Hosea','ho':'Hosea','joel':'Joel','jl':'Joel','amos':'Amos','am':'Amos','obad':'Obadiah','ob':'Obadiah','jonah':'Jonah','jon':'Jonah','mic':'Micah','mi':'Micah','nah':'Nahum','na':'Nahum','hab':'Habakkuk','hb':'Habakkuk','zeph':'Zephaniah','zep':'Zephaniah','hag':'Haggai','hg':'Haggai','zech':'Zechariah','zec':'Zechariah','mal':'Malachi','ml':'Malachi','matt':'Matthew','mt':'Matthew','mark':'Mark','mk':'Mark','luke':'Luke','lk':'Luke','john':'John','jn':'John','acts':'Acts','ac':'Acts','rom':'Romans','ro':'Romans','1 cor':'1 Corinthians','2 cor':'2 Corinthians','1co':'1 Corinthians','2co':'2 Corinthians','gal':'Galatians','ga':'Galatians','eph':'Ephesians','ep':'Ephesians','phil':'Philippians','php':'Philippians','col':'Colossians','co':'Colossians','1 thess':'1 Thessalonians','2 thess':'2 Thessalonians','1th':'1 Thessalonians','2th':'2 Thessalonians','1 tim':'1 Timothy','2 tim':'2 Timothy','1ti':'1 Timothy','2ti':'2 Timothy','titus':'Titus','ti':'Titus','philem':'Philemon','phm':'Philemon','heb':'Hebrews','he':'Hebrews','jas':'James','jm':'James','1 pet':'1 Peter','2 pet':'2 Peter','1pe':'1 Peter','2pe':'2 Peter','1 jn':'1 John','2 jn':'2 John','3 jn':'3 John','1jo':'1 John','2jo':'2 John','3jo':'3 John','jude':'Jude','jd':'Jude','rev':'Revelation','re':'Revelation'};
const es_abbreviations = {'gn':'Genesis','gén':'Genesis','éx':'Exodus','ex':'Exodus','lv':'Leviticus','lev':'Leviticus','nm':'Numbers','núm':'Numbers','dt':'Deuteronomy','deut':'Deuteronomy','jos':'Joshua','jue':'Judges','jc':'Judges','rut':'Ruth','rt':'Ruth','1 sm':'1 Samuel','2 sm':'2 Samuel','1 sa':'1 Samuel','2 sa':'2 Samuel','1 re':'1 Kings','2 re':'2 Kings','1 cr':'1 Chronicles','2 cr':'2 Chronicles','1 cró':'1 Chronicles','2 cró':'2 Chronicles','esd':'Ezra','neh':'Nehemiah','est':'Esther','job':'Job','sal':'Psalms','sl':'Psalms','pr':'Proverbs','prov':'Proverbs','ecl':'Ecclesiastes','ec':'Ecclesiastes','cnt':'Song of Solomon','can':'Song of Solomon','is':'Isaiah','isa':'Isaiah','jer':'Jeremiah','jr':'Jeremiah','lm':'Lamentations','la':'Lamentations','ez':'Ezekiel','ezeq':'Ezekiel','dn':'Daniel','dan':'Daniel','os':'Hosea','jl':'Joel','am':'Amos','abd':'Obadiah','jon':'Jonah','miq':'Micah','mi':'Micah','nah':'Nahum','na':'Nahum','hab':'Habakkuk','ha':'Habakkuk','sof':'Zephaniah','sf':'Zephaniah','hag':'Haggai','ag':'Haggai','zac':'Zechariah','zc':'Zechariah','mal':'Malachi','ml':'Malachi','mt':'Matthew','mat':'Matthew','mc':'Mark','mr':'Mark','lc':'Luke','j':'Luke','jn':'John','hch':'Acts','hech':'Acts','rm':'Romans','rom':'Romans','1 co':'1 Corinthians','2 co':'2 Corinthians','1 cor':'1 Corinthians','2 cor':'2 Corinthians','gá':'Galatians','gál':'Galatians','ef':'Ephesians','efes':'Ephesians','flp':'Philippians','fil':'Philippians','col':'Colossians','1 ts':'1 Thessalonians','2 ts':'2 Thessalonians','1 tes':'1 Thessalonians','2 tes':'2 Thessalonians','1 ti':'1 Timothy','2 ti':'2 Timothy','1 tim':'1 Timothy','2 tim':'2 Timothy','tit':'Titus','tt':'Titus','flm':'Philemon','filem':'Philemon','heb':'Hebrews','he':'Hebrews','stg':'James','sant':'James','1 p':'1 Peter','2 p':'2 Peter','1 pe':'1 Peter','2 pe':'2 Peter','1 jn':'1 John','2 jn':'2 John','3 jn':'3 John','1 jua':'1 John','2 jua':'2 John','3 jua':'3 John','jud':'Jude','jds':'Jude','ap':'Revelation','apoc':'Revelation'};

const full_name_maps: { [lang in Language]: { [name: string]: string } } = { pt: {}, en: {}, es: {} };
for (const canonicalName in bibleBookData) {
    const details = bibleBookData[canonicalName];
    full_name_maps.pt[normalizeString(details.names.pt)] = canonicalName;
    full_name_maps.en[normalizeString(details.names.en)] = canonicalName;
    full_name_maps.es[normalizeString(details.names.es)] = canonicalName;
}

const abbreviationMaps = {
    pt: { ...pt_abbreviations, ...full_name_maps.pt },
    en: { ...en_abbreviations, ...full_name_maps.en },
    es: { ...es_abbreviations, ...full_name_maps.es },
};

export const getAbbreviationMap = (lang: Language): { [key: string]: string } => {
    return abbreviationMaps[lang];
};

export const getBookList = (type: 'ot' | 'nt' | 'dc' | 'ap' | 'all_canon' | 'all' | 'major_prophets' | 'minor_prophets' | 'wisdom' | 'gospels', language: Language): string[] => {
    let canonicalList: string[];
    switch (type) {
        case 'all_canon': canonicalList = [...CANONICAL_ORDER.ot, ...CANONICAL_ORDER.nt, ...CANONICAL_ORDER.dc]; break;
        case 'all': canonicalList = [...CANONICAL_ORDER.ot, ...CANONICAL_ORDER.nt, ...CANONICAL_ORDER.dc, ...CANONICAL_ORDER.ap]; break;
        default: canonicalList = CANONICAL_ORDER[type];
    }
    return canonicalList.map(canonicalName => bibleBookData[canonicalName].names[language]);
};

export const getChapterCount = (canonicalBookName: string): number => {
    return bibleBookData[canonicalBookName]?.chapters || 0;
};

export const getBookName = (canonicalBookName: string, lang: Language): string => {
    return bibleBookData[canonicalBookName]?.names[lang] || canonicalBookName;
};

export const getCanonicalName = (bookName: string, lang: Language): string | undefined => {
    const normalized = normalizeString(bookName);
    return getAbbreviationMap(lang)[normalized];
};

const gospelKeyToCanonicalName: { [key: string]: string } = {
    matthew: 'Matthew', mark: 'Mark', luke: 'Luke', john: 'John'
};

export const getGospelNameFromKey = (gospelKey: string, lang: Language): string => {
    const canonical = gospelKeyToCanonicalName[gospelKey.toLowerCase()];
    return canonical ? getBookName(canonical, lang) : gospelKey;
};