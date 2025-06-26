import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-visor-capitulos',
  standalone: false,
  templateUrl: './visor-capitulos.html',
  styleUrls: ['./visor-capitulos.scss']
})
export class VisorCapitulos {
  paginas: string[];
  paginaActual: number;
  animarImagen = false;

  constructor(
    public dialogRef: MatDialogRef<VisorCapitulos>,
    @Inject(MAT_DIALOG_DATA) public data: { paginas: string[], paginaActual: number, capituloId: number }
  ) {
    this.paginas = data.paginas;
    this.paginaActual = data.paginaActual || 0;

    this.dialogRef.beforeClosed().subscribe(() => {
      localStorage.setItem(`paginaActual_${data.capituloId}`, this.paginaActual.toString());

      if (this.paginaActual >= this.paginas.length - 1) {
        localStorage.setItem(`leido_${this.data.capituloId}`, 'true');
      }
    });
  }

  anterior() {
    if (this.paginaActual > 0) {
      this.animarImagen = true;
      setTimeout(() => this.paginaActual--, 100);
    }
  }

  siguiente() {
    if (this.paginaActual < this.paginas.length - 1) {
      this.animarImagen = true;
      setTimeout(() => this.paginaActual++, 100);
    }
  }

  cerrarVisor() {
    this.dialogRef.close(this.paginaActual);
  }

  onImagenCargada(event: Event) {
    this.animarImagen = false;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.anterior();
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      this.siguiente();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.cerrarVisor();
      event.preventDefault();
    }
  }
}
