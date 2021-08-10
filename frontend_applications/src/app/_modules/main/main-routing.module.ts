import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioAppComponent } from './components/inicio-app/inicio-app.component';
import { AvanzadoComponent } from './components/avanzado/avanzado.component';
import { AutentificacionDigitalComponent } from './components/autentificacion-digital/autentificacion-digital.component';
import { FirmaDigitalComponent } from './components/firma-digital/firma-digital.component';
import { AgenteAutomatizadoComponent } from './components/agente-automatizado/agente-automatizado.component';
import { ValidacionFirmaComponent } from './components/validacion-firma/validacion-firma.component';



const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;


const routes: Routes = [

  {
    path: 'inicio-app/:id',
    data: { breadcrumb: { title: 'Inicio', detail: lorem } },
    component: InicioAppComponent
  },
  {
    path: 'avanzado/:id',
    data: { breadcrumb: { title: 'Avanzado', detail: lorem } },
    component: AvanzadoComponent
  },
  {
    path: 'autenticacion-digital/:id',
    data: { breadcrumb: { title: 'Autenticación  digital', detail: lorem } },
    component: AutentificacionDigitalComponent
  },
  {
    path: 'firma-digital/:id',
    data: { breadcrumb: { title: 'Firma digital', detail: lorem } },
    component: FirmaDigitalComponent
  },

  {
    path: 'agente-automatizado/:id',
    data: { breadcrumb: { title: 'Agente automatizado', detail: lorem } },
    component: AgenteAutomatizadoComponent
  },
  {
    path: 'validacion-firma/:id',
    data: { breadcrumb: { title: 'Validación de firma', detail: lorem } },
    component: ValidacionFirmaComponent
  },

  { path: '', pathMatch: 'full', redirectTo: '/lista' },
  { path: '**', pathMatch: 'full', redirectTo: '/lista' }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
