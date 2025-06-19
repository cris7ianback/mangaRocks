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

    // Agrega aquí manga-update, manga-delete igual
}

module.exports = { registerMangaHandlers };
