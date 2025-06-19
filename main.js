const { app, ipcMain } = require('electron');
const { createWindow } = require('./window');
const { registerLoginHandlers } = require('./ipc/login');
const { registerMangaHandlers } = require('./ipc/mangas');
require('./db/tables');  // Ejecuta la creación de tablas

let mainWindow;

function startApp() {
    mainWindow = createWindow();

    registerLoginHandlers(ipcMain);
    registerMangaHandlers(ipcMain);

    // Otros handlers...
}

app.whenReady().then(startApp);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) startApp();
});
