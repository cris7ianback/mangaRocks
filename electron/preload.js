const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Login (ejemplo)
    login: (credentials) => ipcRenderer.invoke('login', credentials),

    // Mangas
    guardarManga: (manga) => ipcRenderer.invoke('manga-create', manga),
    obtenerMangas: () => ipcRenderer.invoke('manga-list'),
    eliminarManga: (id) => ipcRenderer.invoke('manga-delete', id),
    actualizarManga: (manga) => ipcRenderer.invoke('manga-update', manga),

    // Capítulos
    obtenerCapitulos: (mangaId) => ipcRenderer.invoke('capitulo-list', mangaId),
    guardarCapitulo: (capitulo) => ipcRenderer.invoke('guardarCapitulo', capitulo),
    eliminarCapitulo: (capituloId) => ipcRenderer.invoke('capitulo-delete', capituloId),
    extraerPaginasDesdeArchivo: (archivoPath) => ipcRenderer.invoke('extraerPaginasDesdeArchivo', archivoPath),

    // Agregar muchos capítulos a la vez
    agregarMuchosCapitulos: (capitulos) => ipcRenderer.invoke('capitulos-agregar-muchos', capitulos),


    // Abrir archivo externo si se guarda ruta en disco:
    abrirArchivo: (ruta) => shell.openPath(ruta)
});
