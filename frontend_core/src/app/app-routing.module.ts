import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AppComponent } from './app.component';
import { ErrorComponent } from './pages/error/error.component';
import { DatosComponent } from './pages/datos/datos.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'consent', component: DatosComponent },
  { path: 'error/:code', component: ErrorComponent },
  { path: '**', component: AppComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
