const path = require('path');
const fs = require('fs');
const { app } = require('electron'); // ✅ Agregado para obtener ruta segura
const { db } = require('../db/connection');

let mangaHandlersRegistered = false;

function sanitizarNombre(nombre) {
  return nombre
    .replace(/[<>:"/\\|?*]/g, '')   // elimina caracteres no válidos
    .replace(/\s+/g, '')            // elimina espacios
    .trim();
}

function registerMangaHandlers(ipcMain) {
  if (mangaHandlersRegistered) return;
  mangaHandlersRegistered = true;

  console.log('🧠 Registrando handlers de manga...');

  // Crear manga con verificación de duplicado por título
  ipcMain.handle('manga-create', async (event, manga) => {
    return new Promise((resolve, reject) => {
      const { titulo, autor, descripcion, añoPublicacion, genero, portada } = manga;

      const tituloSanitizado = sanitizarNombre(titulo);

      // ✅ Usamos carpeta segura del sistema para almacenamiento
      const userDataPath = app.getPath('userData');
      const carpetaManga = path.join(userDataPath, 'archivos', tituloSanitizado);
      console.log('📂 Ruta final para carpeta manga:', carpetaManga);

      // Verificar si ya existe en base de datos
      db.get(`SELECT id FROM mangas WHERE titulo = ?`, [titulo], (err, row) => {
        if (err) return reject(err);
        if (row) {
          return resolve({ success: false, message: 'El manga ya existe' });
        }

        try {
          if (fs.existsSync(carpetaManga)) {
            const stats = fs.statSync(carpetaManga);
            if (!stats.isDirectory()) {
              return reject(new Error(`La ruta ${carpetaManga} ya existe y no es una carpeta.`));
            }
          } else {
            fs.mkdirSync(carpetaManga, { recursive: true });
            console.log('📁 Carpeta creada para manga:', carpetaManga);
          }
        } catch (error) {
          return reject(error);
        }

        db.run(`INSERT INTO mangas (titulo, autor, descripcion, añoPublicacion, genero, portada)
                        VALUES (?, ?, ?, ?, ?, ?)`,
          [titulo, autor, descripcion, añoPublicacion, genero, portada],
          function (err) {
            if (err) reject(err);
            else resolve({
              success: true,
              id: this.lastID,
              carpeta: carpetaManga
            });
          }
        );
      });
    });
  });

  // Listar todos los mangas
  ipcMain.handle('manga-list', async () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM mangas', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  });

  // Eliminar un manga
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

  // Actualizar manga
  ipcMain.handle('manga-update', async (event, manga) => {
    return new Promise((resolve, reject) => {
      const { id, titulo, autor, descripcion, añoPublicacion, genero, portada } = manga;

      db.run(
        `UPDATE mangas
                 SET titulo = ?, autor = ?, descripcion = ?, añoPublicacion = ?, genero = ?, portada = ?
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
