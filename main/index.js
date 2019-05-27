const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')
const prepareNext = require('electron-next')
const isDev = require('electron-is-dev')

const menu = require('./menu');

let mainWindow

function createWindow() {
    const menuTemplate = Menu.buildFromTemplate(menu);

    Menu.setApplicationMenu(menuTemplate);

    mainWindow = new BrowserWindow({
        width: 380,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })

    const devPath = 'http://localhost:8000/editor'
    const prodPath = path.resolve('renderer/out/editor/index.html')
    const entry = isDev ? devPath : 'file://' + prodPath

    mainWindow.loadURL(entry)

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', async () => {
    app.setName('Input');

    await prepareNext('./renderer')

    createWindow()
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})
