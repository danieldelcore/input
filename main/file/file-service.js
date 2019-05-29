const path = require('path');
const fs = require('fs');

const open = path =>
    new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) reject(err);

            resolve(data);
        });
    });

const save = (path, data) =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, 'utf-8', err => {
            if (err) reject(err);
            resolve();
        });
    });

module.exports = {
    open,
    save,
};
