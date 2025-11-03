const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'Students_data.csv');
console.log('Reading CSV from:', csvPath);

let rowCount = 0;

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    rowCount++;
    if (rowCount <= 3) {
      console.log('Row', rowCount, ':', JSON.stringify(row, null, 2));
    }
  })
  .on('end', () => {
    console.log('Total rows:', rowCount);
  })
  .on('error', (err) => {
    console.error('Error:', err);
  });
