const { app, ipcMain, protocol, BrowserWindow } = require('electron');
const path = require('path');
const { createWindow } = require('./window');
const { registerLoginHandlers } = require('./ipc/login');
const { registerMangaHandlers } = require('./ipc/mangas');
const { registerCapituloHandlers } = require('./ipc/capitulos');
const { registerCbrHandlers } = require('./ipc/cbr');  // <-- importa el nuevo handler
require('./db/tables');  // Ejecuta la creación de tablas

let mainWindow;

function startApp() {
    console.log('Registrando handlers...');
    mainWindow = createWindow();

    registerLoginHandlers(ipcMain);
    registerMangaHandlers(ipcMain);
    registerCapituloHandlers(ipcMain);  // UNA vez
    registerCbrHandlers(ipcMain);


    // Otros handlers...
}

app.whenReady().then(() => {
    // Registro del protocolo localfile personalizado
    protocol.registerFileProtocol('localfile', (request, callback) => {
        try {
            let url = request.url;
            console.log('URL original:', url);

            if (url.startsWith('localfile://')) {
                url = url.slice('localfile://'.length);
            }
            console.log('Después de eliminar localfile://:', url);

            if (url.startsWith('/')) {
                url = url.slice(1);
            }
            console.log('Después de eliminar "/" inicial:', url);

            url = decodeURIComponent(url);
            console.log('Después de decodeURIComponent:', url);

            // Detecta letra de unidad seguida de / o \ sin los dos puntos
            if (/^[a-zA-Z][\\/]/.test(url) && !/^[a-zA-Z]:[\\/]/.test(url)) {
                url = url[0] + ':' + url.slice(1);
                console.log('Después de agregar ":" a la unidad:', url);
            }

            const fullPath = path.normalize(url);
            console.log('Ruta final normalizada:', fullPath);

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
