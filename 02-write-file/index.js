const path = require('path');
const fs = require('fs');
const nameFile = path.join(__dirname, 'text.txt');

let stream = new fs.createWriteStream(nameFile);
stream.on('error', (err) => console.log(`Err: ${err}`));

const readline = require('readline');
const {stdin: input, stdout: output} = require('process');
const newReadLine = new readline.createInterface({input, output});

let closePrint = () => {console.log('Готово, спасибо!');
    stream.end();
    newReadLine.close();
    process.exit(0);
  };

console.log('Введите, пожалуйста, текст:');

newReadLine.on('line', (input) => {input === 'exit' ? finishJob() : stream.write(input);});
newReadLine.on('SIGINT', () => {closePrint();});



