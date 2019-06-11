const util = require('util');
const path = require('path');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const open = path => readFile(path, 'utf-8');
const save = (path, data) => writeFile(path, data, 'utf-8');

module.exports = {
    open,
    save,
};
