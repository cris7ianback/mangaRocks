import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';  // <-- Importa MatSnackBar

import { Router } from '@angular/router';
import { Manga, ElectronService } from '../../../services/electron.service';
import { MangaDialog } from '../../manga/dialogs/manga-info-dialog/manga-dialog';
import { ConfirmarEliminacion } from '../../shared/confirmar-eliminacion/confirmar-eliminacion';
import { DriveService } from '../../../services/drive.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {

  usuario = {
    nombre: 'Cristian Virago'
  };

  biblioteca: Manga[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly electronService: ElectronService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly driveService: DriveService
  ) { }

  async ngOnInit() {
    this.cargarBiblioteca();
  }

  async cargarBiblioteca() {
    try {
      this.electronService.obtenerMangas().then(mangas => {
        this.biblioteca = mangas.sort((a, b) =>
          a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' })
        );
      });
    } catch (error) {
      console.error('Error cargando mangas:', error);
    }
  }

  abrirDialogoAgregarManga() {
    const dialogRef = this.dialog.open(MangaDialog, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.biblioteca.push(result);
      }
    });
  }

  abrirDialogoEditarManga(mangaId: number) {
    const manga = this.biblioteca.find(m => m.id === mangaId);
    if (!manga) return;

    const dialogRef = this.dialog.open(MangaDialog, {
      width: '600px',
      data: manga
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.biblioteca.findIndex(m => m.id === result.id);
        if (index !== -1) {
          this.biblioteca[index] = result;
        }
      }
    });
  }


  async eliminarManga(mangaId: number, titulo: string) {
    const confirmacion = await this.dialog.open(ConfirmarEliminacion, {
      data: { titulo },
      width: '350px'
    }).afterClosed().toPromise();

    if (confirmacion) {
      try {
        const res = await this.electronService.eliminarManga(mangaId);
        if (res.success) {
          this.biblioteca = this.biblioteca.filter(m => m.id !== mangaId);
          this.snackBar.open('✅ Manga eliminado con éxito', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        } else {
          this.snackBar.open('⚠️ No se pudo eliminar el manga', 'Cerrar', {
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error eliminando manga:', error);
        this.snackBar.open('❌ Error al eliminar el manga', 'Cerrar', {
          duration: 3000,
        });
      }
    }
  }

  abrirDetallesManga(mangaId: number) {
    this.router.navigate(['/manga', mangaId]);
  }

  // async importarDesdeDrive() {
  //   try {
  //     const archivos = await window.electronAPI.listarArchivosDrive('root');
  //     const cbrs = archivos.filter(a => a.name.endsWith('.cbr'));

  //     if (cbrs.length === 0) {
  //       alert('No hay archivos .cbr en tu Google Drive.');
  //       return;
  //     }

  //     const archivo = cbrs[0]; // luego podrías mostrar un diálogo
  //     const ruta = await window.electronAPI.descargarArchivoDrive(archivo.id, archivo.name);

  //     if (ruta) {
  //       alert(`Descargado en: ${ruta}`);
  //       // Aquí puedes llamar a tu lógica de importación de manga
  //     }
  //   } catch (err) {
  //     console.error('Error Drive:', err);
  //     alert('Error conectando con Google Drive');
  //   }
  // }

  async importarDesdeDrive() {
    try {
      // 1. Listar carpetas raíz en Drive
      console.log('Listando carpetas...');
      const carpetas = await this.driveService.listarCarpetasDrive();
      console.log('Carpetas:', carpetas);

      // 2. Abrir diálogo para elegir carpeta (puedes usar un MatDialog con un componente personalizado)
      const carpetaSeleccionada = await this.abrirDialogoSeleccionarCarpeta(carpetas);
      if (!carpetaSeleccionada) return;

      // 3. Listar archivos .cbr dentro de la carpeta seleccionada
      const archivos = await this.driveService.listarArchivosDrive(carpetaSeleccionada.id);
      if (archivos.length === 0) {
        alert('No hay archivos .cbr en la carpeta seleccionada.');
        return;
      }

      // 4. Abrir diálogo para elegir archivo (otro MatDialog con lista)
      const archivoSeleccionado = await this.abrirDialogoSeleccionarArchivo(archivos);
      if (!archivoSeleccionado) return;

      // 5. Descargar el archivo seleccionado y continuar con tu lógica
      const rutaArchivo = await this.driveService.descargarArchivo(archivoSeleccionado.id, archivoSeleccionado.name);

      if (rutaArchivo) {
        // Aquí llamas a tu método para importar el archivo .cbr localmente, ej:
        this.importarCBRLocal(rutaArchivo);
      } else {
        alert('Error al descargar el archivo.');
      }

    } catch (error) {
      console.error('Error en importarDesdeDrive:', error);
      alert(`Ocurrió un error al importar desde Drive: ${error}`);
    }
  }

  abrirDialogoSeleccionarCarpeta(carpetas: { id: string, name: string }[]): Promise<{ id: string, name: string } | null> {
    // Implementar diálogo con MatDialog para seleccionar carpeta, devolver la seleccionada o null si cancela
    return new Promise(resolve => {
      // Ejemplo simple: prompt, reemplaza por diálogo más amigable
      const nombre = prompt('Carpetas disponibles:\n' + carpetas.map(c => c.name).join('\n') + '\nEscribe el nombre de la carpeta:');
      const carpeta = carpetas.find(c => c.name === nombre);
      resolve(carpeta || null);
    });
  }

  abrirDialogoSeleccionarArchivo(archivos: { id: string, name: string }[]): Promise<{ id: string, name: string } | null> {
    // Similar a abrirDialogoSeleccionarCarpeta pero para archivos
    return new Promise(resolve => {
      const nombre = prompt('Archivos disponibles:\n' + archivos.map(a => a.name).join('\n') + '\nEscribe el nombre del archivo:');
      const archivo = archivos.find(a => a.name === nombre);
      resolve(archivo || null);
    });
  }

  importarCBRLocal(ruta: string) {
    // Lógica para importar el archivo .cbr que ya está descargado localmente
    console.log('Archivo descargado en:', ruta);
    // Aquí tu código para importar y agregar a la biblioteca
  }

}


