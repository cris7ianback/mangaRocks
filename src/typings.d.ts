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

      agregarMuchosCapitulos: (capitulos: any[]) => Promise<{ success: boolean; insertedCount: number }>;

      // ✅ Agregados para Google Drive
      listarArchivosDrive: (carpetaId?: string) => Promise<{ id: string; name: string; mimeType: string }[]>;
      descargarArchivoDrive: (fileId: string, nombre: string) => Promise<string | null>;
      listarCarpetasDrive: () => Promise<{ id: string; name: string }[]>;

    };
  }
}
