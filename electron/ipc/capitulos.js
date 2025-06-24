const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { db } = require('../db/connection'); // Importar db al inicio
const { guardarArchivoCBR } = require('../utils/fileHelper');
const { app, ipcMain } = require('electron');
const { path7za } = require('7zip-bin');

// Ruta base donde se guardan los archivos .cbr (ajusta según tu estructura)
const baseArchivosPath = path.resolve(__dirname, '..', 'archivos');
console.log('Base archivos path:', baseArchivosPath);

function getRuta7za() {
    if (app.isPackaged) {
        return path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', '7zip-bin', 'win', 'x64', '7za.exe');
    } else {
        return path7za;
    }
}

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

function extraerPaginasDesdeArchivo(archivoPath) {
    console.log('🗂 [extraerPaginasDesdeArchivo] Archivo recibido:', archivoPath);
    console.log('📁 [extraerPaginasDesdeArchivo] ¿Existe el archivo?', fs.existsSync(archivoPath));

    return new Promise((resolve, reject) => {
        const tempDir = path.join(os.tmpdir(), 'manga_extract_' + crypto.randomBytes(6).toString('hex'));
        console.log('📂 [extraerPaginasDesdeArchivo] Carpeta temporal de extracción:', tempDir);

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
            console.log('📁 [extraerPaginasDesdeArchivo] Carpeta creada:', tempDir);
        } else {
            console.log('📁 [extraerPaginasDesdeArchivo] Carpeta ya existe:', tempDir);
        }

        const ruta7z = `"${getRuta7za()}"`;
        console.log('🧰 [extraerPaginasDesdeArchivo] Ruta 7za:', ruta7z);

        const comando = `${ruta7z} x "${archivoPath}" -o"${tempDir}" -y`;
        console.log('⚙️ [extraerPaginasDesdeArchivo] Comando ejecutado:', comando);

        exec(comando, (error, stdout, stderr) => {
            console.log('📤 [extraerPaginasDesdeArchivo] STDOUT:', stdout);
            console.log('📥 [extraerPaginasDesdeArchivo] STDERR:', stderr);

            if (error) {
                console.error('❌ [extraerPaginasDesdeArchivo] Error ejecutando comando:', error.message);
                return reject(new Error(`Error extrayendo archivo: ${stderr || error.message}`));
            }

            const extensionesPermitidas = ['.jpg', '.jpeg', '.png'];
            let archivosImagenes;

            try {
                archivosImagenes = listarArchivosRecursivo(tempDir, extensionesPermitidas);
                console.log('🖼️ [extraerPaginasDesdeArchivo] Archivos extraídos:', archivosImagenes.length);
            } catch (e) {
                console.error('❌ [extraerPaginasDesdeArchivo] Error listando archivos extraídos:', e.message);
                return reject(e);
            }

            archivosImagenes.forEach((img, idx) => {
                console.log(`🖼️ Imagen ${idx + 1}:`, img);
            });

            const paginas = archivosImagenes
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                .map(f => 'localfile://' + f);

            console.log('📚 [extraerPaginasDesdeArchivo] Total páginas listas:', paginas.length);
            resolve(paginas);
        });
    });
}

// Función para insertar muchos capítulos en la BD
function insertarMuchosCapitulosEnBD(capitulos) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(capitulos) || capitulos.length === 0) {
            return resolve([]);
        }

        const stmt = db.prepare('INSERT INTO capitulos (mangaId, numero, titulo, archivoPath) VALUES (?, ?, ?, ?)');
        const results = [];

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            try {
                for (const capitulo of capitulos) {
                    stmt.run([capitulo.mangaId, capitulo.numero, capitulo.titulo, capitulo.archivoPath], function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        results.push({ id: this.lastID });
                    });
                }
                db.run("COMMIT");
                stmt.finalize();
                resolve(results);
            } catch (e) {
                db.run("ROLLBACK");
                reject(e);
            }
        });
    });
}

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
            db.get('SELECT archivoPath FROM capitulos WHERE id = ?', [capituloId], (err, row) => {
                if (err) return reject(err);
                if (!row) return reject(new Error('Capítulo no encontrado'));

                const archivoPath = row.archivoPath;

                fs.unlink(archivoPath, (fsErr) => {
                    if (fsErr && fsErr.code !== 'ENOENT') {
                        console.warn('No se pudo borrar archivo:', archivoPath, fsErr.message);
                    }

                    db.run('DELETE FROM capitulos WHERE id = ?', [capituloId], function (dbErr) {
                        if (dbErr) reject(dbErr);
                        else resolve({ success: true });
                    });
                });
            });
        });
    });

    ipcMain.handle('extraerPaginasDesdeArchivo', async (event, archivoPath) => {
        console.log('📥 extraerPaginasDesdeArchivo llamado con:', archivoPath);

        archivoPath = decodeURI(archivoPath);
        let rutaCompleta = path.isAbsolute(archivoPath)
            ? archivoPath
            : path.join(baseArchivosPath, archivoPath);

        console.log('📁 Ruta completa procesada:', rutaCompleta);
        if (!fs.existsSync(rutaCompleta)) {
            console.error('❌ Archivo no existe:', rutaCompleta);
            throw new Error('Archivo no encontrado: ' + rutaCompleta);
        }

        const rutaTempArchivo = path.join(os.tmpdir(), 'manga_tmp_' + crypto.randomBytes(6).toString('hex') + path.extname(rutaCompleta));

        try {
            fs.copyFileSync(rutaCompleta, rutaTempArchivo);
            console.log('📄 Archivo copiado a:', rutaTempArchivo);

            const paginas = await extraerPaginasDesdeArchivo(rutaTempArchivo);
            console.log('🖼️ Páginas extraídas:', paginas.length);
            return paginas;
        } catch (error) {
            console.error('❌ Error en extraerPaginasDesdeArchivo:', error);
            throw error;
        } finally {
            if (fs.existsSync(rutaTempArchivo)) {
                fs.unlink(rutaTempArchivo, err => {
                    if (err) console.warn('⚠️ No se pudo eliminar:', rutaTempArchivo);
                    else console.log('🧹 Temporal eliminado:', rutaTempArchivo);
                });
            }
        }
    });

    ipcMain.handle('capitulos-agregar-muchos', async (event, capitulos) => {
        try {
            const insertResults = await insertarMuchosCapitulosEnBD(capitulos);
            return { success: true, insertedCount: insertResults.length };
        } catch (error) {
            console.error('Error agregando muchos capítulos:', error);
            throw error;
        }
    });
}

module.exports = { registerCapituloHandlers };
