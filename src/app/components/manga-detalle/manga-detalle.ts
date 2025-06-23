import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from '../../services/electron.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCapituloDialog } from '../add-capitulo-dialog/add-capitulo-dialog';
import { VisorCapitulos } from '../visor-capitulos/visor-capitulos';

@Component({
  selector: 'app-manga-detalle',
  templateUrl: './manga-detalle.html',
  standalone: false,
  styleUrls: ['./manga-detalle.scss']
})
export class MangaDetalle implements OnInit {

  capitulos: any[] = [];
  capituloSeleccionado: any = null;
  mangaId!: number;
  mangaTitulo = '';
  paginaActual = 0;
  paginas: string[] = [];
  portadaBanner: string | null = null;
  visorAbierto = false;


  constructor(
    private readonly dialog: MatDialog,
    private readonly electronService: ElectronService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  async ngOnInit() {
    this.mangaId = +this.route.snapshot.paramMap.get('id')!;
    await this.cargarCapitulos();
    await this.cargarTitulo();
  }

  // async cargarCapitulos() {
  //   try {
  //     this.capitulos = await this.electronService.obtenerCapitulos(this.mangaId);

  //     for (const c of this.capitulos) {
  //       const paginaIdx = +(localStorage.getItem(`paginaActual_${c.id}`) || '0');
  //       let paginas = JSON.parse(localStorage.getItem(`paginas_${c.id}`) || '[]');

  //       if (paginas.length === 0 && c.archivoPath) {
  //         try {
  //           const extraidas = await this.electronService.extraerPaginasDesdeArchivo(c.archivoPath);
  //           paginas = this.normalizarRutasLocalfile(extraidas);
  //           localStorage.setItem(`paginas_${c.id}`, JSON.stringify(paginas));
  //         } catch (error) {
  //           console.warn('No se pudieron extraer páginas al cargar:', error);
  //         }
  //       }

  //       c.miniatura = paginas.length > 0 ? paginas[paginaIdx] : null;
  //     }
  //   } catch (error) {
  //     console.error('Error cargando capítulos:', error);
  //   }
  // }

  async cargarCapitulos() {
    try {
      this.capitulos = await this.electronService.obtenerCapitulos(this.mangaId);

      this.capitulos.forEach(c => {
        const paginaIdx = +(localStorage.getItem(`paginaActual_${c.id}`) || '0');
        const paginas = JSON.parse(localStorage.getItem(`paginas_${c.id}`) || '[]');

        c.miniatura = paginas.length > 0 ? paginas[paginaIdx] : null;
        c.leido = localStorage.getItem(`leido_${c.id}`) === 'true';
      });

      // 🧠 Reordenar: los no leídos primero
      this.capitulos.sort((a, b) => {
        return a.leido === b.leido ? 0 : a.leido ? 1 : -1;
      });

    } catch (error) {
      console.error('Error cargando capítulos:', error);
    }
  }



  abrirDialogoAgregarCapitulo() {
    const dialogRef = this.dialog.open(AddCapituloDialog, {
      width: '500px',
      data: { mangaId: this.mangaId }
    });

    dialogRef.afterClosed().subscribe(async nuevoCapitulo => {
      if (nuevoCapitulo) {
        try {
          await this.electronService.guardarCapitulo(nuevoCapitulo);
          await this.cargarCapitulos();
        } catch (error) {
          console.error('Error guardando capítulo:', error);
        }
      }
    });
  }

  async eliminarCapitulo(capitulo: any) {
    if (confirm(`¿Eliminar capítulo "${capitulo.titulo}"?`)) {
      try {
        await this.electronService.eliminarCapitulo(capitulo.id);
        await this.cargarCapitulos();
        if (this.capituloSeleccionado?.id === capitulo.id) {
          this.capituloSeleccionado = null;
          this.visorAbierto = false;
          this.paginas = [];
          this.paginaActual = 0;
        }
      } catch (error) {
        console.error('Error eliminando capítulo:', error);
      }
    }
  }

  private normalizarRutasLocalfile(rutas: string[]): string[] {
    return rutas.map(ruta => {
      let path = ruta.replace(/^localfile:\/\//, '');
      path = path.replace(/\\/g, '/');
      return 'localfile://' + encodeURI(path);
    });
  }

  async seleccionarCapitulo(capitulo: any) {
    console.log('[seleccionarCapitulo] Capítulo seleccionado:', capitulo);
    this.capituloSeleccionado = capitulo;

    if (capitulo.archivoPath) {
      console.log('[seleccionarCapitulo] archivoPath:', capitulo.archivoPath);

      try {
        const paginas = await this.electronService.extraerPaginasDesdeArchivo(capitulo.archivoPath);
        console.log('[seleccionarCapitulo] Páginas extraídas:', paginas);

        this.paginas = this.normalizarRutasLocalfile(paginas);

        // Comprobación de si hay rutas inválidas o vacías
        if (paginas.length === 0) {
          console.warn('[seleccionarCapitulo] ¡No se extrajeron imágenes!');
        } else {
          paginas.forEach((img, idx) => {
            console.log(`[seleccionarCapitulo] Imagen ${idx + 1}: ${img}`);
          });
        }

      } catch (err) {
        console.error('[seleccionarCapitulo] Error al extraer páginas:', err);
        this.paginas = [];
      }
    } else {
      console.warn('[seleccionarCapitulo] Capítulo sin archivoPath definido');
    }
  }

  async abrirVisor(capitulo: any) {
    this.capituloSeleccionado = capitulo;

    if (capitulo.archivoPath) {
      try {
        const paginas = await this.electronService.extraerPaginasDesdeArchivo(capitulo.archivoPath);
        this.paginas = paginas.map(p => {
          let path = p.replace(/^localfile:\/\//, '');
          path = path.replace(/\\/g, '/');
          return 'localfile://' + encodeURI(path);
        });

        // Cargar la última página guardada o 0 si no existe
        const paginaGuardada = localStorage.getItem(`paginaActual_${capitulo.id}`);
        this.paginaActual = paginaGuardada ? +paginaGuardada : 0;

        // Abrir diálogo
        const dialogRef = this.dialog.open(VisorCapitulos, {
          data: { paginas: this.paginas, paginaActual: this.paginaActual, capituloId: capitulo.id, },
          width: '70vw',
          maxWidth: '750px',

        });

        // Al cerrar el diálogo actualizar la miniatura con la página guardada
        dialogRef.afterClosed().subscribe(() => {
          const paginaGuardada = localStorage.getItem(`paginaActual_${capitulo.id}`);
          if (paginaGuardada !== null) {
            this.paginaActual = +paginaGuardada;

            // Actualizar miniatura para ese capítulo con la imagen guardada
            this.capitulos = this.capitulos.map(c => {
              if (c.id === capitulo.id) {
                return {
                  ...c,
                  miniatura: this.paginas[this.paginaActual] // actualiza miniatura
                };
              }
              return c;
            });
          }
        });
      } catch (error) {
        console.error('Error extrayendo páginas:', error);
        this.paginas = [];
        this.paginaActual = 0;
      }
    }
  }







  cerrarVisor() {
    this.visorAbierto = false;
    if (this.capituloSeleccionado) {
      localStorage.setItem(`paginaActual_${this.capituloSeleccionado.id}`, this.paginaActual.toString());
    }
  }

  abrirImagenGrande(imgSrc: string) {
    this.dialog.open(VisorCapitulos, {
      data: { imgSrc }
    });
  }

  volverHome() {
    this.router.navigate(['/dashboard']);
  }

  onPaginaChange(nuevaPagina: number) {
    this.paginaActual = nuevaPagina;
    if (this.capituloSeleccionado) {
      localStorage.setItem(`paginaActual_${this.capituloSeleccionado.id}`, nuevaPagina.toString());
    }
  }

  async cargarTitulo() {
    try {
      const mangas = await this.electronService.obtenerMangas();
      const encontrado = mangas.find(m => m.id === this.mangaId);
      if (encontrado) {
        this.mangaTitulo = encontrado.titulo;
        this.portadaBanner = encontrado.portada || null;
      }
    } catch (error) {
      console.error('Error al cargar el título del manga:', error);
    }
  }
}
