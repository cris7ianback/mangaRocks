const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    login: (credentials) => ipcRenderer.invoke('login', credentials),

    guardarManga: (manga) => ipcRenderer.invoke('manga-create', manga),
    obtenerMangas: () => ipcRenderer.invoke('manga-list'),
    obtenerCapitulos: (mangaId) => ipcRenderer.invoke('capitulo-list', mangaId),
    guardarCapitulo: (capitulo) => ipcRenderer.invoke('capitulo-create', capitulo),


    // Si quieres agregar más métodos, los pones aquí, por ejemplo:
    // obtenerMangas: () => ipcRenderer.invoke('manga-list'),
    // eliminarManga: (id) => ipcRenderer.invoke('manga-delete', id),
});