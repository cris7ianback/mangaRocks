const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const sevenBin = require('7zip-bin');

const archivoCbr = path.resolve(__dirname, '../archivos/manga_2/8Kaijuu - Tomo 01 (#001-007).cbr');
const carpetaExtract = path.resolve(__dirname, '../temp_extract');

// Función para extraer el archivo .cbr con 7zip
function extraerCbr(rarPath, outputDir) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const proceso = spawn(sevenBin.path7za, ['x', rarPath, `-o${outputDir}`, '-y']);

        proceso.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        proceso.stderr.on('data', (data) => {
            console.error('Error 7zip:', data.toString());
        });

        proceso.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`7zip terminó con código ${code}`));
            }
        });
    });
}

// Función para listar imágenes en la carpeta extraída (recursiva)
function listarImagenes(dir) {
    const extensionesValidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    let resultados = [];

    function recorrer(carpeta) {
        const archivos = fs.readdirSync(carpeta);

        archivos.forEach((archivo) => {
            const rutaCompleta = path.join(carpeta, archivo);
            const stats = fs.statSync(rutaCompleta);

            if (stats.isDirectory()) {
                recorrer(rutaCompleta);
            } else if (extensionesValidas.includes(path.extname(archivo).toLowerCase())) {
                resultados.push(rutaCompleta);
            }
        });
    }

    recorrer(dir);
    return resultados;
}

// Función principal
async function main() {
    try {
        console.log('Extrayendo archivo:', archivoCbr);
        await extraerCbr(archivoCbr, carpetaExtract);
        console.log('Extracción completada.');

        const imagenes = listarImagenes(carpetaExtract);
        console.log('Imágenes encontradas:', imagenes.length);

        // Opcional: mostrar solo los nombres de archivos
        imagenes.forEach((img) => console.log(path.relative(carpetaExtract, img)));

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
