const { app, shell, ipcMain } = require('electron')
const { is, openNewGitHubIssue } = require('electron-util');

const { showOpenDialog } = require('./file');

const menu = [
    {
        label: app.getName(),
        role: 'appMenu'
    },
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: (menuItem, mainWindow) => {
                    showOpenDialog()
                        .then(data => mainWindow.webContents.send('file-opened', data))
                },
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
            { role: 'close' },
        ]
    },
    { role: 'editMenu' },
    {
        label: 'Format',
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
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            {
                label: 'Toggle Navigation',
                accelerator: 'CmdOrCtrl+\\',
                click: () => console.log('Toggle Navigation')
            },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(is.macos) ? [
                { type: 'separator' },
                { role: 'front' },
            ] : [
                    { role: 'close' }
                ]
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More...',
                click: () => shell.openExternalSync('https://github.com/zeropoly/input')
            },
            {
                label: 'Give Feedback...',
                click: () => openNewGitHubIssue({
                    user: 'zeropoly',
                    repo: 'input'
                })
            }
        ]
    }
];

module.exports = menu;
