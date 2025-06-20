import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';  // importa tu componente login
import { Dashboard } from './components/dashboard/dashboard';
import { MangaDetalle } from './components/manga-detalle/manga-detalle';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // ruta por defecto redirige a login
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'manga/:id', component: MangaDetalle }, // ruta destino
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
