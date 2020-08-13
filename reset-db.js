const fs = require('fs')

const path = './src/db/db.json';

fs.unlink(path, (err) => {
  if (err) {
    console.error(err)
    return
  }

  console.log('db.json successfully deleted...');
})