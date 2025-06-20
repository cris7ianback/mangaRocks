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
import { AddMangaDialog } from './components/add-manga-dialog/add-manga-dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmarEliminacion } from './components/confirmar-eliminacion/confirmar-eliminacion';
import { MangaDetalle } from './components/manga-detalle/manga-detalle';
import { AddCapituloDialog } from './components/add-capitulo-dialog/add-capitulo-dialog';


@NgModule({
  declarations: [
    App,
    LoginComponent,
    Dashboard,
    MangaCard,
    AddMangaDialog,
    ConfirmarEliminacion,
    MangaDetalle,
    AddCapituloDialog
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
    MatDialogModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
