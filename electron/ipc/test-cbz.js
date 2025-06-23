const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function extraerCon7zip(archivo, destino) {
  return new Promise((resolve, reject) => {
    // Crear carpeta destino si no existe
    if (!fs.existsSync(destino)) {
      fs.mkdirSync(destino, { recursive: true });
    }

    // Ruta al ejecutable 7z
    const ruta7z = `"C:\\Program Files\\7-Zip\\7z.exe"`;

    // Comando para extraer: x = extraer con ruta completa, -y = yes to all prompts
    const comando = `${ruta7z} x "${archivo}" -o"${destino}" -y`;

    exec(comando, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

(async () => {
  try {
    const archivoCbr = path.resolve(__dirname, '../archivos/manga_2/8Kaijuu - Tomo 01 (#001-007).cbr');
    const carpetaDestino = path.resolve(__dirname, '../temp_extract');
    const resultado = await extraerCon7zip(archivoCbr, carpetaDestino);
    console.log('Extracción completada:', resultado);
  } catch (error) {
    console.error('Error al extraer con 7zip:', error);
  }
})();
