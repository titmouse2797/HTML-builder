let path = require('path');
let fs = require('fs/promises');
let dirname = path.join(__dirname, 'files');
let dirnameCopy = path.join(__dirname, 'files-copy');

fs.rm(dirnameCopy, {
    recursive: true,
    force: true
}).finally(function() {
    fs.mkdir(dirnameCopy, {
        recursive: true
    });
    fs.readdir(dirname , {
        withFileTypes: true
    }).then(function(data) {
        data.forEach(function(item) {
            if (item.isFile()) {
                let pathItem = path.join(dirname, item.name);
                let pathItemDes = path.join(dirnameCopy, item.name);
                fs.copyFile(pathItem, pathItemDes);}
        });
    });
});
