import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Manga, ElectronService } from '../../../../services/electron.service';
import { SnackbarService } from '../../../../services/snackbar.service';



@Component({
  selector: 'app-manga-dialog',
  templateUrl: './manga-dialog.html',
  standalone: false,
  styleUrls: ['./manga-dialog.scss']
})
export class MangaDialog implements OnInit {
  id?: number;
  titulo = '';
  autor? = '';
  fechaPublicacion: number | null = null;
  genero? = '';
  descripcion? = '';
  portada = '';
  vistaPrevia: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Manga | null,
    private readonly electronService: ElectronService,
    private readonly snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<MangaDialog>,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      // Modo edición
      const { id, titulo, autor, añoPublicacion, genero, descripcion, portada } = this.data;
      this.id = id;
      this.titulo = titulo;
      this.autor = autor;
      this.fechaPublicacion = añoPublicacion ?? null;
      this.genero = genero;
      this.descripcion = descripcion;
      this.portada = portada;
      this.vistaPrevia = portada;
    }
  }

  onPortadaChange() {
    this.vistaPrevia = this.portada;
  }

  async guardar() {
    if (!this.titulo || !this.portada) return;

    const manga: Manga = {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      añoPublicacion: this.fechaPublicacion,
      genero: this.genero,
      descripcion: this.descripcion,
      portada: this.portada
    };

    try {
      let res;
      if (this.id) {
        // Editar
        res = await this.electronService.actualizarManga(manga);
      } else {
        // Agregar nuevo
        res = await this.electronService.guardarManga(manga);
      }

      if (res.success) {
        this.snackbarService.open(this.id ? 'Manga editado' : 'Manga agregado');
        this.dialogRef.close({ ...manga, id: res.id ?? this.id });
      }
      else {
        this.snackbarService.open('Error al guardar manga', 'error');
      }
    } catch (err) {
      console.error('Error al guardar el manga:', err);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
