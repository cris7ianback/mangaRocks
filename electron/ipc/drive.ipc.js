const {
  listarArchivosEnCarpeta,
  listarCarpetas, // ✅ nuevo
  descargarArchivo
} = require('../utils/drive/driveService');

function registerDriveHandlers(ipcMain) {
  // Listar archivos .cbr en una carpeta (o root por defecto)
  ipcMain.handle('drive:listar', async (_, carpetaId) => {
    try {
      const archivos = await listarArchivosEnCarpeta(carpetaId || 'root');
      return archivos;
    } catch (err) {
      console.error('❌ Error al listar archivos en Drive:', err);
      return [];
    }
  });

  // ✅ Listar carpetas disponibles
  ipcMain.handle('drive:carpetas', async () => {
    try {
      const carpetas = await listarCarpetas();
      return carpetas;
    } catch (err) {
      console.error('❌ Error al listar carpetas en Drive:', err);
      return [];
    }
  });

  // Descargar archivo por ID
  ipcMain.handle('drive:descargar', async (_, { fileId, nombre }) => {
    try {
      const ruta = await descargarArchivo(fileId, nombre);
      return ruta;
    } catch (err) {
      console.error('❌ Error al descargar desde Drive:', err);
      return null;
    }
  });
}

module.exports = { registerDriveHandlers };
