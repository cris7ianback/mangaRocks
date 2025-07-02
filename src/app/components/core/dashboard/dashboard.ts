import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';  // <-- Importa MatSnackBar

import { Router } from '@angular/router';
import { Manga, ElectronService } from '../../../services/electron.service';
import { MangaDialog } from '../../manga/dialogs/manga-info-dialog/manga-dialog';
import { ConfirmarEliminacion } from '../../shared/confirmar-eliminacion/confirmar-eliminacion';

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
    private readonly router: Router
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
}
