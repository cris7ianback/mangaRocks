// ipc/capitulos.js
const db = require('../db/connection');

function registerCapituloHandlers(ipcMain) {
    // Listar capítulos de un manga
    ipcMain.handle('capitulo-list', async (event, mangaId) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM capitulos WHERE mangaId = ? ORDER BY numero',
                [mangaId],
                (err, rows) => {
                    if (err) {
                        console.error('Error listando capítulos:', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    });

    // Guardar capítulo: backend calcula número automáticamente
    ipcMain.handle('guardarCapitulo', async (event, capitulo) => {
        return new Promise((resolve, reject) => {
            const { mangaId, titulo, archivo } = capitulo;
            // 1) Obtener el máximo número actual para este manga
            db.get(
                'SELECT MAX(numero) as maxNum FROM capitulos WHERE mangaId = ?',
                [mangaId],
                (err, row) => {
                    if (err) {
                        console.error('Error obteniendo máximo número:', err);
                        return reject(err);
                    }
                    const nextNum = (row && row.maxNum != null) ? row.maxNum + 1 : 1;
                    // 2) Insertar con nextNum
                    db.run(
                        'INSERT INTO capitulos (mangaId, numero, titulo, archivoBase64) VALUES (?, ?, ?, ?)',
                        [mangaId, nextNum, titulo, archivo],
                        function (err2) {
                            if (err2) {
                                console.error('Error guardando capítulo:', err2);
                                reject(err2);
                            } else {
                                resolve({ success: true, id: this.lastID, numero: nextNum });
                            }
                        }
                    );
                }
            );
        });
    });
}

module.exports = { registerCapituloHandlers };
