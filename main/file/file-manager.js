const { dialog, BrowserWindow } = require('electron');

const fileService = require('./file-service');

const showOpenDialog = defaultPath =>
    new Promise((resolve, reject) => {
        dialog.showOpenDialog(
            {
                defaultPath,
                properties: ['openFile'],
                filters: [
                    {
                        name: 'Files',
                        extensions: ['txt', 'md', 'mdx'],
                    },
                ],
            },
            filePaths => {
                if (!filePaths || filePaths.length === 0) {
                    reject('cancelled');
                    return;
                }

                fileService
                    .open(filePaths[0])
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            },
        );
    });

const showSaveDialog = (document, defaultPath = 'input.md') =>
    new Promise((resolve, reject) => {
        dialog.showSaveDialog(
            {
                broweserWindow: BrowserWindow.getFocusedWindow(),
                defaultPath,
                filters: [
                    {
                        name: 'Files',
                        extensions: ['md', 'txt', 'mdx'],
                    },
                ],
            },
            filePath => {
                if (!filePath) {
                    resolve();
                    return;
                }

                resolve(
                    fileService.save(filePath, document).then(() => filePath),
                );
            },
        );
    });

module.exports = {
    showOpenDialog,
    showSaveDialog,
};
