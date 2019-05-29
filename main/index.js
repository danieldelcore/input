const path = require('path');
const { app, ipcMain, BrowserWindow, Menu } = require('electron');
const prepareNext = require('electron-next');
const isDev = require('electron-is-dev');

const menu = require('./menu');
const { showOpenDialog, showSaveDialog } = require('./file');

let mainWindow;

function createWindow() {
    const menuTemplate = Menu.buildFromTemplate(menu);

    Menu.setApplicationMenu(menuTemplate);

    mainWindow = new BrowserWindow({
        width: 380,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    const devPath = 'http://localhost:8000/editor';
    const prodPath = path.resolve('renderer/out/editor/index.html');
    const entry = isDev ? devPath : 'file://' + prodPath;

    mainWindow.loadURL(entry);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', async () => {
    app.setName('Input');

    await prepareNext('./renderer');

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

/**
 * https://electronjs.org/docs/api/app#event-open-url-macos
 */
app.on('open-file', (event, path) => {
    showOpenDialog().then(data => console.log(data));
});

ipcMain.on('save-file', (event, document) => {
    showSaveDialog(document).catch(err => console.log(err));
});
