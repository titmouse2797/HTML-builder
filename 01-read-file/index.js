const path = require('path');
const fs = require('fs');
const nameFile = path.join(__dirname, 'text.txt'); 
const stream = new fs.ReadStream(nameFile, {encoding: 'utf-8'});

stream.on('readable', function () {
    const result = stream.read();
    if (result != null) console.log(result);});

stream.on('error', function (err) {
    console.log(err.message);
});
