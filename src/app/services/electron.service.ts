import { Injectable, NgZone } from '@angular/core';
import { LoadingService } from './loading.service';
import { BehaviorSubject } from 'rxjs';

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
  archivo: ArrayBuffer;
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
  progresoCarga$ = new BehaviorSubject<{ total: number, procesados: number, titulo: string } | null>(null);

  constructor(private loadingService: LoadingService, private zone: NgZone) {
    if ((window as any).require) {
      try {
        this.ipcRenderer = (window as any).require('electron').ipcRenderer;

        // Escuchar eventos de progreso
        this.ipcRenderer.on('progreso-carga-capitulos', (event: any, data: any) => {
          // NgZone para actualizar en Angular zone
          this.zone.run(() => {
            this.progresoCarga$.next(data);
          });
        });

      } catch {
        console.warn('Electron\'s IPC was not loaded');
      }
    }
  }

  private get api() {
    if (window.electronAPI) return window.electronAPI;
    throw new Error('electronAPI no está disponible');
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> {
    this.loadingService.show();
    try {
      return await this.api.login(credentials);
    } finally {
      this.loadingService.hide();
    }
  }

  async obtenerMangas(): Promise<Manga[]> {
    this.loadingService.show();
    try {
      return await this.api.obtenerMangas();
    } finally {
      this.loadingService.hide();
    }
  }

  async guardarManga(manga: Manga): Promise<{ success: boolean; id?: number }> {
    this.loadingService.show();
    try {
      return await this.api.guardarManga(manga);
    } finally {
      this.loadingService.hide();
    }
  }

  async obtenerCapitulos(mangaId: number): Promise<Capitulo[]> {
    this.loadingService.show();
    try {
      return await this.api.obtenerCapitulos(mangaId);
    } finally {
      this.loadingService.hide();
    }
  }

  async guardarCapitulo(capitulo: Capitulo): Promise<{ success: boolean; id?: number }> {
    this.loadingService.show();
    try {
      return await this.api.guardarCapitulo(capitulo);
    } finally {
      this.loadingService.hide();
    }
  }

  async eliminarManga(id: number): Promise<{ success: boolean }> {
    this.loadingService.show();
    try {
      return await this.api.eliminarManga(id);
    } finally {
      this.loadingService.hide();
    }
  }

  async eliminarCapitulo(id: number): Promise<{ success: boolean }> {
    this.loadingService.show();
    try {
      return await this.api.eliminarCapitulo(id);
    } finally {
      this.loadingService.hide();
    }
  }

  async extraerPaginasDesdeArchivo(archivoPath: string): Promise<string[]> {
    this.loadingService.show();
    try {
      return await this.api.extraerPaginasDesdeArchivo(archivoPath);
    } finally {
      this.loadingService.hide();
    }
  }

  async actualizarManga(manga: Manga): Promise<any> {
    this.loadingService.show();
    try {
      return await this.api.actualizarManga(manga);
    } finally {
      this.loadingService.hide();
    }
  }

  async agregarMuchosCapitulos(capitulos: Capitulo[]): Promise<{ success: boolean; insertedCount: number }> {
    this.loadingService.show();
    this.progresoCarga$.next({ total: capitulos.length, procesados: 0, titulo: '' });
    try {
      const result = await this.api.agregarMuchosCapitulos(capitulos);
      this.progresoCarga$.next(null); // limpiar progreso
      return result;
    } finally {
      this.loadingService.hide();
    }
  }




}
