import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-manga-card',
  standalone: false,
  templateUrl: './manga-card.html',
  styleUrl: './manga-card.scss'
})
export class MangaCard {
  @Input() manga: any;
  @Output() eliminar = new EventEmitter<number>();
  @Output() abrirDetalle = new EventEmitter<number>();
  @Output() editar = new EventEmitter<number>();

  eliminarManga(event: MouseEvent) {
    event.stopPropagation(); // Evita que también se dispare el abrirDetalle
    this.eliminar.emit(this.manga.id);
  }

  abrirDetalleManga() {
    this.abrirDetalle.emit(this.manga.id);
  }

  editarManga(event: MouseEvent) {
    event.stopPropagation();
    this.editar.emit(this.manga.id);
  }

}
