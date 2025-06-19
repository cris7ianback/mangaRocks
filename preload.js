const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Login
    login: (credentials) => ipcRenderer.invoke('login', credentials),

    // Mangas
    guardarManga: (manga) => ipcRenderer.invoke('manga-create', manga),
    obtenerMangas: () => ipcRenderer.invoke('manga-list'),
    eliminarManga: (id) => ipcRenderer.invoke('manga-delete', id),
    actualizarManga: (manga) => ipcRenderer.invoke('manga-update', manga),

    // Capitulos
    guardarCapitulo: (capitulo) => ipcRenderer.invoke('capitulo-create', capitulo),
    obtenerCapitulos: (mangaId) => ipcRenderer.invoke('capitulo-list', mangaId)
});
