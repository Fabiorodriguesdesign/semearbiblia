
const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');

const inputFile = path.join(__dirname, '../functions/biblia_kjv_final.json');
const outputDir = path.join(__dirname, 'books');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Create a readable stream from the large JSON file
const stream = fs.createReadStream(inputFile, { encoding: 'utf8' });

// Use JSONStream to parse the array of books
const parser = JSONStream.parse('*'); // This will emit each element of the root array

stream.pipe(parser);

parser.on('data', (book) => {
  const bookName = book.name;
  const bookFileName = `${bookName}.json`;
  const outputPath = path.join(outputDir, bookFileName);

  // Write the book data to its own file
  fs.writeFile(outputPath, JSON.stringify(book, null, 2), (err) => {
    if (err) {
      console.error(`Error writing file for ${bookName}:`, err);
    } else {
      console.log(`Successfully created ${bookFileName}`);
    }
  });
});

parser.on('end', () => {
  console.log('All books have been processed.');
});

stream.on('error', (err) => {
  console.error('Error reading the input file:', err);
});
