const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const startFolder = 'project-dist';
const secondtHTML = 'index.html';
const secondStyle = 'style.css';
const assetsFld = 'assets';
const templateFile = path.join(__dirname, '/template.html');
const componentsFolder = 'components';
const stylesFld = 'styles';

let templateText = '';
let componentList = [];
let componentsText = {};
let stylesList = [];
let stylesText = '';

const makeDir = () => {
    fsPromises.mkdir(path.join(__dirname, startFolder))
    .then(() => console.log('Успешно'))
    .catch(err => console.log('Ошибка', err.code));
};

const readComponentFiles = () => {
  return new Promise((resolve) => {
    fsPromises.readdir(path.join(__dirname, componentsFolder), {withFileTypes: true})
      .then(files => {
        files.forEach(file => {
          let currentFile = path.parse(file.name);
          if (currentFile.ext === '.html') componentList.push(currentFile.name);
        });
        resolve();
      });
  });
};

const loadComponentData = (component) => {
  return new Promise(resolve => {
    let stream = new fs.createReadStream(path.join(__dirname, componentsFolder, component + '.html'), {encoding: 'utf-8'});

    stream.on('readable', () => {
      let data = stream.read();
      if (data != null) {
        componentsText[component] = data;
        resolve();
      }
    });
  });
};

const readcomponentsText = () => {
  return new Promise(resolve => {
    let arr = [];
    componentList.forEach((component) => {
      arr.push(loadComponentData(component));
    });
    Promise.all(arr).then(() => resolve());
  });
};

const writeResult = (fileName, payload) => {
  return new Promise(resolve => {
    const writeStream = new fs.createWriteStream(fileName, {encoding: 'utf-8'});

    writeStream.on('ready', () => writeStream.write(payload) );

    writeStream.on('close', () => {
      writeStream.end();
      resolve();
    });
  });
};

makeDir();

let htmlflow = new Promise((resolve, reject) => {
  let stream = new fs.createReadStream(templateFile, {encoding: 'utf-8'});

  stream.on('readable', () => {
    let data = stream.read();
    if (data != null) {
        templateText = data;
      resolve();
    }
  });

  stream.on('error', (err) => {
    reject( ()=> console.log(err));
  });

});

htmlflow
 .then(() => {
    return readComponentFiles();
  })
  .then(() => {
    return readcomponentsText();
  })
  .then(() => {
    let resultContent = templateText;
    componentList.forEach(el => {
      resultContent = resultContent.replace(`{{${el}}}`, componentsText[el]);
    });
    console.log('HTML-flow закончена.');
    return writeResult(path.join(__dirname, startFolder, secondtHTML), resultContent);
  })
  .catch(err => console.log('HTML-flow ошибка', err.code));

const loadStylesData = (style) => {
  return new Promise(resolve => {
    let stream = new fs.createReadStream(path.join(__dirname, stylesFld, style + '.css'), {encoding: 'utf-8'});

    stream.on('readable', () => {
      let data = stream.read();
      if (data != null) {
        stylesText += data;
        resolve();
      }
    });
  });
};

const readstylesText = () => {
  return new Promise(resolve => {
    let stylesArr = [];
    stylesList.forEach((style) => {
      stylesArr.push(loadStylesData(style));
    });
    Promise.all(stylesArr).then(() => resolve());
  });
};

const writeStyles = (fileName, payload) => {
  return new Promise(resolve => {
    const writeStream = new fs.createWriteStream(fileName, {encoding: 'utf-8'});

    writeStream.on('ready', () => writeStream.write(payload));

    writeStream.on('close', () => {
      writeStream.end();
      resolve();
    });
  });
};

let cssFlow = new Promise((resolve) => {
    fsPromises.readdir(path.join(__dirname, stylesFld), {withFileTypes: true})
    .then(files => {
      files.forEach(file => {
        let currentFile = path.parse(file.name);
        if (currentFile.ext === '.css') stylesList.push(currentFile.name);
      });
      resolve();
    });
});

cssFlow
  .then(() => {
    return readstylesText();
  })
  .then(() => {
    console.log('Styles-flow завершена.');
    return writeStyles(path.join(__dirname, startFolder, secondStyle), stylesText);
  });

const copyFolder = (source, target) => {
    fsPromises.readdir(source, {withFileTypes: true})
    .then(files => {
      return new Promise(resolve => {
        files.forEach(file => {
          if (file.isDirectory()) {
            fsPromises.mkdir(path.join(target, file.name), {recursive: true})
              .then(() => copyFolder(path.join(source, file.name), path.join(target, file.name)));
          }
        });
        resolve();
      })
        .then(() => {
          files.forEach(file => {
            if (file.isFile()) {
                fsPromises.copyFile(path.join(source, file.name), path.join(target, file.name), 0)
                .catch( () => console.log('Файл не может быть скопирован'));
            }
          });
        });
    })
    .catch(err => (err !== undefined) && console.log(err));
};

copyFolder(path.join(__dirname, assetsFld), path.join(__dirname, startFolder, assetsFld));