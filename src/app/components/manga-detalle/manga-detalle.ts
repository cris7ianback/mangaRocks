import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from '../../services/electron.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCapituloDialog } from '../add-capitulo-dialog/add-capitulo-dialog';
import { VisorCapitulos } from '../visor-capitulos/visor-capitulos';
import { AddMuchosCapitulosDialog } from '../add-muchos-capitulos-dialog/add-muchos-capitulos-dialog';
import { EditMangaDialog } from '../edit-manga-dialog/edit-manga-dialog';

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

        // Guardar en localStorage para poder usar miniatura luego
        localStorage.setItem(`paginas_${capitulo.id}`, JSON.stringify(this.paginas));

        const paginaGuardada = localStorage.getItem(`paginaActual_${capitulo.id}`);
        this.paginaActual = paginaGuardada ? +paginaGuardada : 0;

        const dialogRef = this.dialog.open(VisorCapitulos, {
          data: { paginas: this.paginas, paginaActual: this.paginaActual, capituloId: capitulo.id },
          panelClass: 'visor-dialog',
          autoFocus: false,
          disableClose: false,
          maxWidth: '100vw',
          maxHeight: '100vh'
        });

        dialogRef.afterClosed().subscribe(() => {
          const paginaGuardada = localStorage.getItem(`paginaActual_${capitulo.id}`);
          if (paginaGuardada !== null) {
            this.paginaActual = +paginaGuardada;

            this.capitulos = this.capitulos.map(c => {
              if (c.id === capitulo.id) {
                return {
                  ...c,
                  miniatura: this.paginas[this.paginaActual]
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


  // Función para leer varios archivos como ArrayBuffer
  leerArchivosComoBuffers(files: File[]): Promise<ArrayBuffer[]> {
    return Promise.all(
      files.map(file =>
        new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = () => reject(new Error(`Error leyendo archivo ${file.name}`));
          reader.readAsArrayBuffer(file);
        })
      )
    );
  }

  abrirDialogoAgregarMuchosCapitulos() {

    const dialogRef = this.dialog.open(AddMuchosCapitulosDialog, {
      width: '600px',
      data: { mangaId: this.mangaId }
    });

    dialogRef.afterClosed().subscribe(async (capitulosNuevos: File[] | null) => {
      console.log('[🔵] Diálogo cerrado');

      if (!capitulosNuevos || capitulosNuevos.length === 0) {
        console.log('[⚪] No se seleccionaron archivos.');
        return;
      }

      console.log(`[🟢] Se seleccionaron ${capitulosNuevos.length} archivos:`);

      try {
        // Leer todos los archivos como ArrayBuffer usando el método de la clase
        const buffers = await this.leerArchivosComoBuffers(capitulosNuevos);

        // Preparar datos para enviar al backend
        const capitulosParaEnviar = capitulosNuevos.map((file, i) => ({
          mangaId: this.mangaId,
          numero: 0,   // Número temporal, el backend puede recalcularlo
          titulo: file.name,
          archivo: buffers[i]  // cambia según el nombre que use tu backend
        }));

        console.log('[🟡] Enviando capítulos al servicio Electron...');
        const resultado = await this.electronService.agregarMuchosCapitulos(capitulosParaEnviar);

        console.log('[✅] Capítulos enviados correctamente:', resultado);

        console.log('[🔄] Cargando capítulos actualizados...');
        await this.cargarCapitulos();
        console.log('[✅] Capítulos actualizados.');

      } catch (error) {
        console.error('[❌] Error guardando capítulos múltiples:', error);
      }
    });
  }


  editarManga(manga: any) {
    const dialogRef = this.dialog.open(EditMangaDialog, {
      width: '400px',
      data: manga
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí llamas a tu ElectronService o servicio para guardar los cambios
        this.electronService.actualizarManga(result.id, result.nombre, result.descripcion);
      }
    });


  }
}