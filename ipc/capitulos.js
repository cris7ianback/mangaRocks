// 📁 ipc/capitulos.js
const db = require('../db/connection');

function registerCapituloHandlers(ipcMain) {
    ipcMain.handle('capitulo-create', async (event, capitulo) => {
        return new Promise((resolve, reject) => {
            const { mangaId, titulo, numero, contenido } = capitulo;
            db.run(`INSERT INTO capitulos (mangaId, titulo, numero, contenido) VALUES (?, ?, ?, ?)`,
                [mangaId, titulo, numero, contenido],
                function (err) {
                    if (err) reject(err);
                    else resolve({ success: true, id: this.lastID });
                });
        });
    });

    ipcMain.handle('capitulo-list', async (event, mangaId) => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM capitulos WHERE mangaId = ?', [mangaId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    });
}

module.exports = { registerCapituloHandlers };