const { dialog, BrowserWindow } = require('electron');

const fileService = require('./file-service');

const showOpenDialog = defaultPath =>
    new Promise((resolve) => {
        dialog.showOpenDialog({
            defaultPath,
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

const showSaveDialog = (document, defaultPath = 'input.md') =>
    new Promise((resolve, reject) => {
        dialog.showSaveDialog({
            broweserWindow: BrowserWindow.getFocusedWindow(),
            defaultPath,
            filters: [{
                name: 'Files',
                extensions: ['md', 'txt', 'mdx'],
            }],
        }, (filePath) => {
            if (!filePath) {
                resolve();
                return;
            }

            resolve(
                fileService
                    .save(filePath, document)
                    .then(() => filePath)
            );
        });
    });

module.exports = {
    showOpenDialog,
    showSaveDialog,
};
