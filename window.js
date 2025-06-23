const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, 'dist/mangaRocks/browser/index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        // opcional: puedes setear mainWindow=null aquí
    });

    return mainWindow;
}

module.exports = { createWindow };
