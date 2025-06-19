import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ElectronService, Manga } from '../../services/electron.service';


@Component({
  selector: 'app-add-manga-dialog',
  templateUrl: './add-manga-dialog.html',
  standalone: false,
  styleUrls: ['./add-manga-dialog.scss']
})
export class AddMangaDialog {
  titulo = '';
  autor = '';
  fechaPublicacion: number | null = null;
  genero = '';
  descripcion = '';
  portada = '';

  vistaPrevia: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddMangaDialog>,
    private readonly electronService: ElectronService
  ) { }

  onPortadaChange() {
    this.vistaPrevia = this.portada;
  }

  async guardar() {
    if (!this.titulo || !this.portada) return;

    const nuevoManga: Manga = {
      titulo: this.titulo,
      autor: this.autor,
      añoPublicacion: this.fechaPublicacion,
      genero: this.genero,
      descripcion: this.descripcion,
      portada: this.portada
    };

    try {
      const res = await this.electronService.guardarManga(nuevoManga);
      if (res.success) {
        this.dialogRef.close({ ...nuevoManga, id: res.id });
      }
    } catch (err) {
      console.error('Error al guardar el manga:', err);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
