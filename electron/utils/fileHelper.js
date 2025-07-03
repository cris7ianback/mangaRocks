const fs = require('fs');
const path = require('path');
const { db } = require('../db/connection');
const { app } = require('electron');

function validarRutaComoCarpeta(ruta) {
  const partes = ruta.split(path.sep);
  let rutaParcial = partes[0] === '' ? path.sep : partes[0]; // manejar rutas absolutas

  for (let i = 1; i < partes.length; i++) {
    rutaParcial = path.join(rutaParcial, partes[i]);
    if (fs.existsSync(rutaParcial)) {
      const stats = fs.statSync(rutaParcial);
      if (!stats.isDirectory()) {
        throw new Error(`❌ La ruta intermedia "${rutaParcial}" existe pero NO es un directorio`);
      }
    } else {
      // No existe, crear carpeta
      fs.mkdirSync(rutaParcial);
      console.log(`📂 Carpeta creada: ${rutaParcial}`);
    }
  }
}

function sanitizarNombre(nombre) {
  return nombre
    .replace(/[<>:"/\\|?*']/g, '')  // quitar caracteres inválidos
    .replace(/\s+/g, '_')           // reemplazar espacios por guiones bajos
    .trim();
}

function getRutaCarpetaManga(titulo) {
  const userDataPath = app.getPath('userData');
  const tituloSanitizado = sanitizarNombre(titulo);
  return path.join(userDataPath, 'archivos', tituloSanitizado);
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
  const carpeta = getRutaCarpetaManga(titulo); // usa misma lógica del create

  if (fs.existsSync(carpeta)) {
    const stat = fs.statSync(carpeta);
    if (!stat.isDirectory()) {
      throw new Error(`❌ La ruta ${carpeta} existe pero no es un directorio`);
    }
  } else {
    fs.mkdirSync(carpeta, { recursive: true });
  }

  const nombreArchivoSanitizado = sanitizarNombre(nombreOriginal);
  const rutaFinal = path.join(carpeta, nombreArchivoSanitizado);

  return new Promise((resolve, reject) => {
    fs.writeFile(rutaFinal, bufferBinario, err => {
      if (err) return reject(err);
      resolve(rutaFinal);
    });
  });
}


module.exports = { guardarArchivoCBR };
