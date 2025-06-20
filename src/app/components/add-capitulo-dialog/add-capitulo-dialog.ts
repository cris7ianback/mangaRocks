import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Capitulo } from '../../services/electron.service';

@Component({
  selector: 'app-add-capitulo-dialog',
  templateUrl: './add-capitulo-dialog.html',
  standalone: false,
  styleUrls: ['./add-capitulo-dialog.scss']
})
export class AddCapituloDialog {
  titulo: string = '';
  fileData: File | null = null;
  numero!: number;
  fileBase64: string | null = null;
  archivo: any;

  constructor(
    public dialogRef: MatDialogRef<AddCapituloDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { mangaId: number }
  ) { }

  async ngOnInit() {
    // Opcional: asignar automáticamente siguiente número
    // try {
    //   const lista = await this.electronService.obtenerCapitulos(this.data.mangaId);
    //   this.numero = lista.length + 1;
    // } catch {
    //   this.numero = 1;
    // }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileData = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.fileBase64 = reader.result as string;
      reader.readAsDataURL(this.fileData);
    }
  }

  guardar() {
    if (this.titulo.trim() && this.fileBase64 && this.numero != null) {
      const nuevo: Capitulo = {
        mangaId: this.data.mangaId,
        numero: this.numero,
        titulo: this.titulo,
        archivo: this.fileBase64
      };
      this.dialogRef.close(nuevo);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
