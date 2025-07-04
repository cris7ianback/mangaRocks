import { Component, OnInit } from '@angular/core';
import { DriveService } from '../../../services/drive.service';


@Component({
  selector: 'app-drive-explorer',
  standalone: false,
  templateUrl: './drive-explorer.html',
  styleUrl: './drive-explorer.scss'
})
export class DriveExplorerComponent implements OnInit {

  carpetas: { id: string; name: string }[] = [];
  archivos: { id: string; name: string }[] = [];
  carpetaSeleccionadaId: string | null = null;
  cargando = false;

  constructor(private readonly driveService: DriveService) { }

  async ngOnInit() {
    this.cargando = true;
    try {
      this.carpetas = await this.driveService.listarCarpetasDrive();
    } catch (error) {
      alert('Error al cargar carpetas de Drive');
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }

  async onCarpetaChange() {
    if (!this.carpetaSeleccionadaId) {
      this.archivos = [];
      return;
    }
    this.cargando = true;
    try {
      this.archivos = await this.driveService.listarArchivosDrive(this.carpetaSeleccionadaId);
      if (this.archivos.length === 0) alert('No hay archivos .cbr en esta carpeta.');
    } catch (error) {
      alert('Error al listar archivos de Drive');
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }
}
