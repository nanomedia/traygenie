import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccesoDatosComponent } from './components/acceso-datos/acceso-datos.component';
import { DispositivosComponent } from './components/dispositivos/dispositivos.component';
import { InfoPersonalComponent } from './components/info-personal/info-personal.component';
import { InicioComponent } from './components/inicio/inicio.component';

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;


const routes: Routes = [
  {
    path: 'inicio',
    data: { breadcrumb: { title: 'Inicio', detail: lorem } },
    component: InicioComponent
  },
  {
    path: 'info-personal',
    data: { breadcrumb: { title: 'Información Personal', detail: lorem } },
    component: InfoPersonalComponent
  },
  {
    path: 'acceso-datos',
    data: { breadcrumb: { title: 'Inicio', detail: lorem } },
    component: AccesoDatosComponent
  },
  {
    path: 'dispositivos',
    data: { breadcrumb: { title: 'Inicio', detail: lorem } },
    component: DispositivosComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenRoutingModule { }
