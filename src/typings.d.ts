export { };

declare global {
    interface Window {
        electronAPI: {
            login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
            guardarManga: (manga: any) => Promise<{ success: boolean; id?: number }>;
            obtenerMangas: () => Promise<any[]>;
            eliminarManga: (id: number) => Promise<{ success: boolean }>;
            obtenerCapitulos: (mangaId: number) => Promise<any[]>;
            guardarCapitulo: (capitulo: any) => Promise<{ success: boolean; id?: number }>;
            eliminarCapitulo: (id: number) => Promise<{ success: boolean }>;

            extraerPaginasDesdeBase64: (archivoBase64: string) => Promise<string[]>;
            extraerPaginasDesdeArchivo: (archivoPath: string) => Promise<string[]>;
            actualizarManga: (manga: any) => Promise<{ success: boolean; changes?: number }>;
        };
    }
}
