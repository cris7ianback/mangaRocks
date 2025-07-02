import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/core/dashboard/dashboard';
import { LoginComponent } from './components/core/login/login';
import { MangaDetalle } from './components/manga/tomo/manga-detalle/manga-detalle';



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
