export { };

declare global {
    interface Window {
        electronAPI: {
            login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
            guardarManga: (manga: any) => Promise<{ success: boolean; id?: number }>;
            obtenerMangas: () => Promise<any[]>;          // Para listar mangas
            eliminarManga: (id: number) => Promise<{ success: boolean }>;  // Para eliminar manga
            obtenerCapitulos: (mangaId: number) => Promise<any[]>;
            guardarCapitulo: (capitulo: any) => Promise<{ success: boolean; id?: number }>;
        };
    }
}