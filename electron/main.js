const { app, ipcMain, protocol, BrowserWindow } = require('electron');
const path = require('path');
const { createWindow } = require('./window');
const { registerLoginHandlers } = require('./ipc/login');
const { registerMangaHandlers } = require('./ipc/mangas');
const { registerCapituloHandlers } = require('./ipc/capitulos');
const { registerCbrHandlers } = require('./ipc/cbr');
const { registerDriveHandlers } = require('./ipc/drive.ipc');


const { inicializarBaseDeDatos } = require('./db/initDatabase');
inicializarBaseDeDatos();

let mainWindow;

function startApp() {
  console.log('Registrando handlers...');
  mainWindow = createWindow();

  registerLoginHandlers(ipcMain);
  registerMangaHandlers(ipcMain);
  registerCapituloHandlers(ipcMain);
  registerCbrHandlers(ipcMain);
  registerDriveHandlers(ipcMain); // 🆕 Aquí registras el nuevo módulo
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
