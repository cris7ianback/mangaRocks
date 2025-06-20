import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from '../../services/electron.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCapituloDialog } from '../add-capitulo-dialog/add-capitulo-dialog';

@Component({
  selector: 'app-manga-detalle',
  templateUrl: './manga-detalle.html',
  standalone: false,
  styleUrls: ['./manga-detalle.scss']
})
export class MangaDetalle implements OnInit {
  mangaId!: number;
  tomos: any[] = [];
  capitulos: any[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly electronService: ElectronService,
    private readonly route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.mangaId = +this.route.snapshot.paramMap.get('id')!;
    await this.cargarCapitulos();
  }

  async cargarCapitulos() {
    this.capitulos = await this.electronService.obtenerCapitulos(this.mangaId);
  }

  abrirDialogoAgregarCapitulo() {
    const dialogRef = this.dialog.open(AddCapituloDialog, {
      width: '400px',
      data: { mangaId: this.mangaId }
    });

    dialogRef.afterClosed().subscribe(async nuevoCapitulo => {
      if (nuevoCapitulo) {
        await this.electronService.guardarCapitulo(nuevoCapitulo);
        await this.cargarCapitulos();
      }
    });
  }
}
