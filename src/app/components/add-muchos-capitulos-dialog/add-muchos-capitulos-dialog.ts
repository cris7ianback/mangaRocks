import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'add-muchos-capitulos-dialog',
  standalone: false,
  templateUrl: './add-muchos-capitulos-dialog.html',
  styleUrls: ['./add-muchos-capitulos-dialog.scss']
})
export class AddMuchosCapitulosDialog {

  archivos: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddMuchosCapitulosDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { mangaId: number }
  ) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.archivos = Array.from(input.files);
  }

  agregar() {
    // Devuelve la lista de archivos al componente que abrió el diálogo
    this.dialogRef.close(this.archivos);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
