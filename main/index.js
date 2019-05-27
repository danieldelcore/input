const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')
const prepareNext = require('electron-next')
const isDev = require('electron-is-dev')
const { openNewGithubIssue, aboutMenuItem } = require('electron-util');

let mainWindow

const menu = Menu.buildFromTemplate([
    {
        label: 'App',
        submenu: [
            aboutMenuItem({
                copyright: 'Copyright © ZeroPoly',
            }),
            {
                label: 'Give Feedback...',
                click: () => openNewGitHubIssue({
                    user: 'zeropoly',
                    repo: 'input',
                    body: ``,
                })
            },
            { type: 'separator' },
            {
                label: 'Preferences',
                accelerator: 'CmdOrCtrl+,',
                click: () => console.log('Preferences'),
            },
            {
                label: 'Check for Updates',
                click: () => console.log('Check for updates...')
            },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: () => console.log('Open'),
            },
            { type: 'separator' },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => console.log('Save'),
            },
            {
                label: 'Save As...',
                click: () => console.log('Save As...')
            },
            { type: 'separator' },
            {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                click: () => console.log('Close')
            },
        ]
    },
    {
        label: 'Fromat',
        submenu: [
            {
                label: 'Bold',
                accelerator: 'CmdOrCtrl+B',
                click: () => console.log('Bold'),
            },
            {
                label: 'Emphasis',
                accelerator: 'CmdOrCtrl+I',
                click: () => console.log('Italics'),
            },
            {
                label: 'Underline',
                accelerator: 'CmdOrCtrl+U',
                click: () => console.log('Underline')
            },
            {
                label: 'Strike',
                accelerator: 'CmdOrCtrl+~',
                click: () => console.log('Strike')
            },
        ]
    }
]);

function createWindow() {
    Menu.setApplicationMenu(menu);

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
