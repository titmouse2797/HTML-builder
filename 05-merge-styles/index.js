const fs = require('fs/promises');
const fsClear = require('fs');
const path = require('path');
const firstDir = 'styles';
const secondtDir = 'project-dist';
const newFile = 'bundle.css';
let dataLng = [];

const readFiles = (filename) => {
    
    console.log('Merging: ', filename);

  let streamRead = new fsClear.createstreamRead(filename, {encoding: 'utf-8'});

  streamRead.on('readable', () => {
    let data = streamRead.read();
    (data !== null) && dataLng.push(data);
  });
  streamRead.on('error', err => {
    err.message === 'ENOENT' ? console.log('Файл не найден') : console.error(err);
  });

  streamRead.on('end', () => {
    let stream = new fsClear.createstream(path.join(__dirname, secondtDir, newFile));
    dataLng.forEach(el => stream.write(el));
    stream.end();
  });
};

fs.readdir(path.join(__dirname, firstDir), {withFileTypes: true})
  .then(files => {
    files.forEach(file => {
      if (file.isFile() && path.parse(file.name).ext.substring(1) === 'css') {
        readFiles(path.join(__dirname, firstDir, file.name));
      }
    });
  })

  .catch(err => (err !== undefined) && console.log(err));