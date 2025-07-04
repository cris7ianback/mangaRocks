import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  listarCarpetasDrive(): Promise<{ id: string; name: string }[]> {
    return window.electronAPI.listarCarpetasDrive();
  }

  listarArchivosDrive(idCarpeta: string): Promise<{ id: string; name: string }[]> {
    return window.electronAPI.listarArchivosDrive(idCarpeta);
  }

  descargarArchivo(fileId: string, nombre: string): Promise<string | null> {
    return window.electronAPI.descargarArchivoDrive(fileId, nombre);
  }
}
