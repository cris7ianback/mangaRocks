import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddMangaDialog } from '../add-manga-dialog/add-manga-dialog';
import { ElectronService, Manga } from '../../services/electron.service';


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  usuario = {
    nombre: 'Cristian Virago'
  };

  biblioteca: Manga[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly electronService: ElectronService
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

  async eliminarManga(mangaId: number) {
    try {
      const res = await this.electronService.eliminarManga(mangaId);
      if (res.success) {
        this.biblioteca = this.biblioteca.filter(m => m.id !== mangaId);
      } else {
        console.error('No se pudo eliminar el manga');
      }
    } catch (error) {
      console.error('Error eliminando manga:', error);
    }
  }
}
