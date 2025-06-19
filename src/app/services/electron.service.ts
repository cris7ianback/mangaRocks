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
    titulo?: string;
    contenido: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class ElectronService {
    private get api() {
        if (window.electronAPI) return window.electronAPI;
        throw new Error('electronAPI no está disponible');
    }

    login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> {
        return this.api.login(credentials);
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

    // Puedes agregar otros métodos que tengas en electronAPI aquí, por ejemplo:
    // obtenerMangas(): Promise<Manga[]> {
    //   return this.api.obtenerMangas();
    // }

    // eliminarManga(id: number): Promise<{ success: boolean }> {
    //   return this.api.eliminarManga(id);
    // }
}
