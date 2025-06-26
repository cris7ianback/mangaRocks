const fs = require('fs');
const path = require('path');
const { db } = require('../db/connection');

function sanitizarNombre(nombre) {
    return nombre
        .replace(/[<>:"/\\|?*']/g, '')  // quitar caracteres inválidos
        .replace(/\s+/g, '_')           // reemplazar espacios por guiones bajos
        .trim();
}

function getNombreManga(mangaId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT titulo FROM mangas WHERE id = ?', [mangaId], (err, row) => {
            if (err) return reject(err);
            if (!row) return reject(new Error('Manga no encontrado'));
            resolve(row.titulo);
        });
    });
}

async function guardarArchivoCBR(mangaId, nombreOriginal, bufferBinario) {
    const titulo = await getNombreManga(mangaId);
    const tituloSanitizado = sanitizarNombre(titulo);

    const carpeta = path.join(__dirname, '..', 'archivos', tituloSanitizado);
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });

    const nombreArchivoSanitizado = sanitizarNombre(nombreOriginal);
    const rutaFinal = path.join(carpeta, nombreArchivoSanitizado);

    // Aquí ya bufferBinario es un Buffer, no string base64
    return new Promise((resolve, reject) => {
        fs.writeFile(rutaFinal, bufferBinario, err => {
            if (err) return reject(err);
            resolve(rutaFinal);
        });
    });
}

module.exports = { guardarArchivoCBR };
