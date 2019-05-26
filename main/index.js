const path = require('path')
const { app, BrowserWindow } = require('electron')
const prepareNext = require('electron-next')
const isDev = require('electron-is-dev')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    const devPath = 'http://localhost:8000/editor'
    const prodPath = path.resolve('renderer/out/editor/index.html')
    const entry = isDev ? devPath : 'file://' + prodPath

    mainWindow.loadURL(entry)

    // if (isDev) {
    //   mainWindow.webContents.openDevTools()
    // }

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', async () => {
    await prepareNext('./renderer')
    createWindow()
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})
