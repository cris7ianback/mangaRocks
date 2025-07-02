import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { MatListModule } from '@angular/material/list';

import { LoadingOverlay } from './shared/loading-overlay/loading-overlay';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { Dashboard } from './components/core/dashboard/dashboard';
import { LoginComponent } from './components/core/login/login';
import { AddTomoDialog } from './components/manga/dialogs/add-tomo/add-tomo-dialog';
import { AddMuchosCapitulosDialog } from './components/manga/dialogs/add-muchos-capitulos/add-muchos-capitulos-dialog';
import { EditMangaDialog } from './components/manga/dialogs/edit-manga/edit-manga-dialog';
import { MangaDialog } from './components/manga/dialogs/manga-info-dialog/manga-dialog';
import { MangaCard } from './components/manga/manga-card/manga-card';
import { MangaDetalle } from './components/manga/tomo/manga-detalle/manga-detalle';
import { VisorCapitulos } from './components/manga/tomo/visor-capitulos/visor-capitulos';
import { ConfirmarEliminacion } from './components/shared/confirmar-eliminacion/confirmar-eliminacion';



@NgModule({
  declarations: [
    App,
    LoginComponent,
    Dashboard,
    MangaCard,
    MangaDialog,
    ConfirmarEliminacion,
    MangaDetalle,
    AddTomoDialog,
    VisorCapitulos,
    LoadingOverlay,
    AddMuchosCapitulosDialog,
    EditMangaDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    MatProgressSpinnerModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
