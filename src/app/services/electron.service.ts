import { Injectable } from '@angular/core';

export interface Manga {
    titulo: string;
    autor?: string;
    añoPublicacion?: number | null;
    genero?: string;
    descripcion?: string;
    portada: string;
    id?: number;
}

export interface Capitulo {
    id?: number;
    mangaId: number;
    numero: number;
    titulo: string;
    archivo: string;         // nuevo campo para base64
    // Si ya no usas 'contenido', elimínalo; o si lo usas distinto, manténlo aparte.
}

export interface LoginCredentials {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class ElectronService {

    ipcRenderer: any;

    constructor() {
        if ((window as any).require) {
            try {
                this.ipcRenderer = (window as any).require('electron').ipcRenderer;
            } catch (e) {
                console.warn('Electron\'s IPC was not loaded');
            }
        }
    }
    private get api() {
        if (window.electronAPI) return window.electronAPI;
        throw new Error('electronAPI no está disponible');
    }

    login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> {
        return this.api.login(credentials);
    }

    obtenerMangas(): Promise<Manga[]> {
        return this.api.obtenerMangas();
    }

    guardarManga(manga: Manga): Promise<{ success: boolean; id?: number }> {
        return this.api.guardarManga(manga);
    }

    obtenerCapitulos(mangaId: number): Promise<Capitulo[]> {
        return this.api.obtenerCapitulos(mangaId);
    }

    guardarCapitulo(capitulo: Capitulo): Promise<{ success: boolean; id?: number }> {
        return this.api.guardarCapitulo(capitulo);
    }

    eliminarManga(id: number): Promise<{ success: boolean }> {
        return this.api.eliminarManga(id);
    }

    async eliminarCapitulo(id: number): Promise<{ success: boolean }> {
        return window.electronAPI.eliminarCapitulo(id);
    }

    extraerPaginasDesdeArchivo(archivoPath: string): Promise<string[]> {
        return this.api.extraerPaginasDesdeArchivo(archivoPath);
    }

    actualizarManga(manga: Manga): Promise<any> {
        return window.electronAPI.actualizarManga(manga);
    }


    // Puedes agregar otros métodos que tengas en electronAPI aquí, por ejemplo:
    // obtenerMangas(): Promise<Manga[]> {
    //   return this.api.obtenerMangas();
    // }

    // eliminarManga(id: number): Promise<{ success: boolean }> {
    //   return this.api.eliminarManga(id);
    // }
}
