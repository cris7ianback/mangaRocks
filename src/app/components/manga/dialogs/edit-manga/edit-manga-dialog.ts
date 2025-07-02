import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-manga-dialog',
  standalone: false,
  templateUrl: './edit-manga-dialog.html',
  styleUrl: './edit-manga-dialog.scss'
})
export class EditMangaDialog {

  manga: { id: number; nombre: string; descripcion: string };

  constructor(
    public dialogRef: MatDialogRef<EditMangaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.manga = {
      id: data.id,
      nombre: data.nombre || '',
      descripcion: data.descripcion || ''
    };
  }

  guardar() {
    this.dialogRef.close(this.manga); // Retorna los cambios al componente padre
  }

  cancelar() {
    this.dialogRef.close();
  }

}
