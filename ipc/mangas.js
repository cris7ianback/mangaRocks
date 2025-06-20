const db = require('../db/connection');

function registerMangaHandlers(ipcMain) {
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
    // ✅ Agregar handler para eliminar manga
    ipcMain.handle('manga-delete', async (event, mangaId) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM mangas WHERE id = ?', [mangaId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ success: true, deletedId: mangaId });
                }
            });
        });
    });

    // ✅ Agregar handler para actualizar manga
    ipcMain.handle('manga-update', async (event, manga) => {
        return new Promise((resolve, reject) => {
            const { id, titulo, autor, descripcion, añoPublicacion, genero, portada } = manga;
            db.run(
                `UPDATE mangas SET titulo = ?, autor = ?, descripcion = ?, añoPublicacion = ?, genero = ?, portada = ? 
                 WHERE id = ?`,
                [titulo, autor, descripcion, añoPublicacion, genero, portada, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ success: true, changes: this.changes });
                }
            );
        });
    });
}

module.exports = { registerMangaHandlers };
