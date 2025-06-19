export { };

declare global {
    interface Window {
        electronAPI: {
            login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
            guardarManga: (manga: any) => Promise<{ success: boolean; id?: number }>;
            obtenerCapitulos: (mangaId: number) => Promise<any[]>;  // agrega aquí
            guardarCapitulo: (capitulo: any) => Promise<{ success: boolean; id?: number }>; // si lo usas también

        };
    }
}
