const fs = require('fs/promises');
const path = require('path');
const fsClear = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
  .then(files => {
    files.forEach(file => {
      file.isFile() && (fsClear.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
          const currentFile = path.parse(file.name);
          console.log(currentFile.name + ' - ' + currentFile.ext.substring(1) + ' - ' + stats.size + ' bytes');
        }));
    });
  })
  
  .catch(err => err !== undefined && console.log(err));