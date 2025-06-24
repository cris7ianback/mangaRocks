import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { LoginComponent } from './components/login/login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Dashboard } from './components/dashboard/dashboard';
import { MangaCard } from './components/manga-card/manga-card';
import { MangaDialog } from './components/manga-dialog/manga-dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmarEliminacion } from './components/confirmar-eliminacion/confirmar-eliminacion';
import { MangaDetalle } from './components/manga-detalle/manga-detalle';
import { AddCapituloDialog } from './components/add-capitulo-dialog/add-capitulo-dialog';
import { MatListModule } from '@angular/material/list';
import { VisorCapitulos } from './components/visor-capitulos/visor-capitulos';
import { LoadingOverlay } from './shared/loading-overlay/loading-overlay';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';


@NgModule({
  declarations: [
    App,
    LoginComponent,
    Dashboard,
    MangaCard,
    MangaDialog,
    ConfirmarEliminacion,
    MangaDetalle,
    AddCapituloDialog,
    VisorCapitulos,
    LoadingOverlay
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
