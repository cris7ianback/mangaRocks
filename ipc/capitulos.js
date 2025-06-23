const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const db = require('../db/connection');
const { guardarArchivoCBR } = require('../utils/fileHelper');

// Listar imágenes recursivamente por extensiones
function listarArchivosRecursivo(dir, extensiones) {
    let resultados = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    list.forEach(dirent => {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            resultados = resultados.concat(listarArchivosRecursivo(fullPath, extensiones));
        } else {
            if (extensiones.some(ext => dirent.name.toLowerCase().endsWith(ext))) {
                resultados.push(fullPath);
            }
        }
    });
    return resultados;
}

// Extraer páginas desde un archivo .cbr usando 7-Zip
function extraerPaginasDesdeArchivo(archivoPath) {
    return new Promise((resolve, reject) => {
        const tempDir = path.join(os.tmpdir(), 'manga_extract_' + crypto.randomBytes(6).toString('hex'));

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const ruta7z = `"C:\\Program Files\\7-Zip\\7z.exe"`; // Ajusta si es necesario
        const comando = `${ruta7z} x "${archivoPath}" -o"${tempDir}" -y`;

        console.log('Ejecutando:', comando);

        exec(comando, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(`Error extrayendo archivo: ${stderr || error.message}`));
            }

            console.log('Extracción completada en:', tempDir);

            const extensionesPermitidas = ['.jpg', '.jpeg', '.png'];
            let archivosImagenes;
            try {
                archivosImagenes = listarArchivosRecursivo(tempDir, extensionesPermitidas);
            } catch (e) {
                return reject(e);
            }

            console.log('Archivos de imagen encontrados:', archivosImagenes);

            const paginas = archivosImagenes
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                .map(f => 'localfile://' + f);

            resolve(paginas);
        });
    });
}


// Registro de handlers
function registerCapituloHandlers(ipcMain) {
    ipcMain.handle('capitulo-list', async (event, mangaId) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM capitulos WHERE mangaId = ? ORDER BY numero',
                [mangaId],
                (err, rows) => {
                    if (err) {
                        console.error('❌ Error listando capítulos:', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    });

    ipcMain.handle('guardarCapitulo', async (event, capitulo) => {
        const { mangaId, titulo, archivoNombreOriginal, archivoBuffer } = capitulo;
        try {
            const rutaFinal = await guardarArchivoCBR(mangaId, archivoNombreOriginal, archivoBuffer);

            console.log('📁 Archivo guardado en:', rutaFinal);

            const nextNum = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT MAX(numero) as maxNum FROM capitulos WHERE mangaId = ?',
                    [mangaId],
                    (err, row) => {
                        if (err) return reject(err);
                        resolve(row?.maxNum != null ? row.maxNum + 1 : 1);
                    }
                );
            });

            const res = await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO capitulos (mangaId, numero, titulo, archivoPath) VALUES (?, ?, ?, ?)',
                    [mangaId, nextNum, titulo, rutaFinal],
                    function (err) {
                        if (err) return reject(err);
                        resolve({ success: true, id: this.lastID });
                    }
                );
            });

            return res;
        } catch (error) {
            console.error('❌ Error en guardarCapitulo:', error);
            throw error;
        }
    });

    ipcMain.handle('capitulo-delete', async (event, capituloId) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM capitulos WHERE id = ?', [capituloId], function (err) {
                if (err) reject(err);
                else resolve({ success: true });
            });
        });
    });

    ipcMain.handle('extraerPaginasDesdeArchivo', async (event, archivoPath) => {
        console.log('📥 extraerPaginasDesdeArchivo llamado con:', archivoPath);
        try {
            const paginas = await extraerPaginasDesdeArchivo(archivoPath);
            console.log('🖼️ Páginas extraídas:', paginas.length);
            return paginas;
        } catch (error) {
            console.error('❌ Error en extraerPaginasDesdeArchivo:', error);
            throw error;
        }
    });
}

module.exports = { registerCapituloHandlers };
