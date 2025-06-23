// utils/fileHelper.js
const fs = require('fs');
const path = require('path');

function guardarArchivoCBR(mangaId, nombreOriginal, bufferBase64) {
    return new Promise((resolve, reject) => {
        const carpeta = path.join(__dirname, '..', 'archivos', `manga_${mangaId}`);
        if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });

        const rutaFinal = path.join(carpeta, nombreOriginal);
        const buffer = Buffer.from(bufferBase64, 'base64');

        fs.writeFile(rutaFinal, buffer, err => {
            if (err) return reject(err);
            resolve(rutaFinal);
        });
    });
}

module.exports = { guardarArchivoCBR };
