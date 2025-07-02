import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-eliminacion',
  standalone: false,
  templateUrl: './confirmar-eliminacion.html'
})
export class ConfirmarEliminacion {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarEliminacion>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string }
  ) { }
}
