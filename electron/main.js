const { app, ipcMain, protocol, BrowserWindow } = require('electron');
const path = require('path');
const { createWindow } = require('./window');
const { registerLoginHandlers } = require('./ipc/login');
const { registerMangaHandlers } = require('./ipc/mangas');
const { registerCapituloHandlers } = require('./ipc/capitulos');
const { registerCbrHandlers } = require('./ipc/cbr');

// ✅ Llamar inicialización completa de base de datos
const { inicializarBaseDeDatos } = require('./db/initDatabase');
inicializarBaseDeDatos(); // ← solo esto, sin require('./db/tables')

let mainWindow;

function startApp() {
    console.log('Registrando handlers...');
    mainWindow = createWindow();

    registerLoginHandlers(ipcMain);
    registerMangaHandlers(ipcMain);
    registerCapituloHandlers(ipcMain);
    registerCbrHandlers(ipcMain);
}

app.whenReady().then(() => {
    protocol.registerFileProtocol('localfile', (request, callback) => {
        try {
            let url = decodeURIComponent(request.url.replace('localfile://', '').replace(/^\/+/, ''));
            if (/^[a-zA-Z][\\/]/.test(url) && !/^[a-zA-Z]:[\\/]/.test(url)) {
                url = url[0] + ':' + url.slice(1);
            }
            const fullPath = path.normalize(url);
            callback({ path: fullPath });
        } catch (error) {
            console.error('Error en protocolo localfile:', error);
        }
    });

    startApp();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) startApp();
});
