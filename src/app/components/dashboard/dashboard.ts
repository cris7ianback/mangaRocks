import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';  // <-- Importa MatSnackBar
import { AddMangaDialog } from '../add-manga-dialog/add-manga-dialog';
import { ElectronService, Manga } from '../../services/electron.service';
import { ConfirmarEliminacion } from '../confirmar-eliminacion/confirmar-eliminacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']  // <-- Corrige a styleUrls (plural)
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
      this.biblioteca = await this.electronService.obtenerMangas();
    } catch (error) {
      console.error('Error cargando mangas:', error);
    }
  }

  abrirDialogoAgregarManga() {
    const dialogRef = this.dialog.open(AddMangaDialog);

    dialogRef.afterClosed().subscribe(async (nuevoManga) => {
      if (nuevoManga) {
        try {
          const res = await this.electronService.guardarManga(nuevoManga);
          if (res.success && res.id) {
            nuevoManga.id = res.id;
            this.biblioteca.push(nuevoManga);
          }
        } catch (error) {
          console.error('Error guardando manga:', error);
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
