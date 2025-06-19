const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// 🔄 Recarga automática en desarrollo
try {
    require('electron-reload')(__dirname, {
        electron: require(path.join(__dirname, 'node_modules', 'electron')),
        ignored: /node_modules|[\/\\]\./
    });
} catch (e) {
    console.error(e)
    console.warn('electron-reload no activo');
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Detectar entorno: desarrollo o producción
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, 'dist/mangaRocks/browser/index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 📦 Ruta de la base de datos
const dbPath = path.join(app.getPath('userData'), 'mangadb.sqlite');
const db = new sqlite3.Database(dbPath);

// 🧠 Crear tablas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS mangas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT,
    descripcion TEXT,
    añoPublicacion INTEGER,
    genero TEXT,
    portada TEXT
  )`);
});

// 👤 Login
ipcMain.handle('login', async (event, { username, password }) => {
    return new Promise((resolve) => {
        db.get('SELECT password FROM usuarios WHERE username = ?', [username], (err, row) => {
            if (err) return resolve({ success: false, message: 'Error en base de datos.' });
            if (!row) return resolve({ success: false, message: 'Usuario no encontrado.' });

            bcrypt.compare(password, row.password, (err, result) => {
                if (result) resolve({ success: true });
                else resolve({ success: false, message: 'Contraseña incorrecta.' });
            });
        });
    });
});

// 📚 CRUD de mangas

ipcMain.handle('manga-create', async (event, manga) => {
    return new Promise((resolve, reject) => {
        const { titulo, autor, descripcion, añoPublicacion, genero, portada } = manga;
        db.run(`INSERT INTO mangas (titulo, autor, descripcion, añoPublicacion, genero, portada) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [titulo, autor, descripcion, añoPublicacion, genero, portada],
            function (err) {
                if (err) reject(err);
                else resolve({ success: true, id: this.lastID });
            });
    });
});

ipcMain.handle('manga-list', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM mangas', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle('manga-update', async (event, manga) => {
    return new Promise((resolve, reject) => {
        const { id, titulo, autor, descripcion, añoPublicacion, genero, portada } = manga;
        db.run(`UPDATE mangas SET titulo=?, autor=?, descripcion=?, añoPublicacion=?, genero=?, portada=? WHERE id=?`,
            [titulo, autor, descripcion, añoPublicacion, genero, portada, id],
            function (err) {
                if (err) reject(err);
                else resolve({ success: this.changes > 0 });
            });
    });
});

ipcMain.handle('manga-delete', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM mangas WHERE id=?', [id], function (err) {
            if (err) reject(err);
            else resolve({ success: this.changes > 0 });
        });
    });
});

// 🔄 Ciclo de vida
app.whenReady().then(createWindow);

app.allowRendererProcessReuse = true;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
