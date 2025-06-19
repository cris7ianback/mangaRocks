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

  eliminarManga() {
    this.eliminar.emit(this.manga.id);
  }

}
