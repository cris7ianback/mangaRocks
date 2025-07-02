import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-tomo-dialog',
  templateUrl: './add-tomo-dialog.html',
  standalone: false,
  styleUrls: ['./add-tomo-dialog.scss']
})
export class AddTomoDialog {
  titulo = '';
  archivoSeleccionado: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddTomoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { mangaId: number }
  ) { }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  archivoAArrayBuffer(archivo: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = err => reject(err);
      reader.readAsArrayBuffer(archivo);
    });
  }

  async guardar() {
    if (!this.archivoSeleccionado || !this.titulo) return;

    const buffer = await this.archivoAArrayBuffer(this.archivoSeleccionado);
    // Envía buffer directamente, usando el método adecuado:
    this.dialogRef.close({
      titulo: this.titulo,
      mangaId: this.data.mangaId,
      archivoNombreOriginal: this.archivoSeleccionado.name,
      archivoBuffer: buffer // aquí envías el ArrayBuffer directamente
    });
  }
}
