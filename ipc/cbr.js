const { ipcMain } = require('electron');

// Otros handlers específicos para cbr si los tienes
// Pero NO registres aquí 'extraerPaginasDesdeArchivo'

function registerCbrHandlers(ipcMain) {
    // Por ahora sin handlers para evitar conflicto
}

module.exports = { registerCbrHandlers };
