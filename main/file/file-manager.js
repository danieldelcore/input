const { dialog } = require('electron');

const fileService = require('./file-service');

const showOpenDialog = path =>
    new Promise((resolve) => {
        dialog.showOpenDialog({
            defaultPath: path,
            properties: ['openFile'],
            filters: [{
                name: 'Files',
                extensions: ['txt', 'md', 'mdx'],
            }],
        }, (filePaths) => {
            if (!filePaths || filePaths.length === 0) {
                resolve();
                return;
            }

            resolve(fileService.open(filePaths[0]));
        });
    });

const showSaveDialog = (path, document) =>
    new Promise((resolve, reject) => {
        dialog.showSaveDialog({
            defaultPath: path,
        }, (filePaths) => {
            if (!filePaths || filePaths.length === 0) {
                resolve();
                return;
            }

            resolve(
                fileService
                    .save(filePaths[0], document)
                    .then(() => filePaths)
            );
        });
    });

module.exports = {
    showOpenDialog,
    showSaveDialog,
};
