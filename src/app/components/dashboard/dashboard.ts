import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddMangaDialog } from '../add-manga-dialog/add-manga-dialog';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  usuario = {
    nombre: 'Cristian Virago'
  };

  biblioteca = [
    { id: 1, titulo: 'One Piece', portada: 'assets/onepiece.jpg' },
    { id: 2, titulo: 'Naruto', portada: 'assets/naruto.jpg' }
  ];

  constructor(private readonly dialog: MatDialog) { }

  abrirDialogoAgregarManga() {
    const dialogRef = this.dialog.open(AddMangaDialog);

    dialogRef.afterClosed().subscribe((nuevoManga) => {
      if (nuevoManga) {
        this.biblioteca.push(nuevoManga);
      }
    });
  }

  eliminarManga(mangaId: number) {
    this.biblioteca = this.biblioteca.filter(m => m.id !== mangaId);
  }

}
