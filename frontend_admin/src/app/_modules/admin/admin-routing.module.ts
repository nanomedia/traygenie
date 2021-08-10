import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarinstitucionComponent } from './components/editarinstitucion/editarinstitucion.component';
import { EditarjefeproyectosComponent } from './components/editarjefeproyectos/editarjefeproyectos.component';
import { InstitucionesComponent } from './components/instituciones/instituciones.component';
import { JefeproyectosComponent } from './components/jefeproyectos/jefeproyectos.component';
import { NuevainstitucionComponent } from './components/nuevainstitucion/nuevainstitucion.component';
import { NuevojefeproyectosComponent } from './components/nuevojefeproyectos/nuevojefeproyectos.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { VersionesComponent } from './components/versiones/versiones.component';


const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const routes: Routes = [
  {
    path: 'institutions',
    data: { breadcrumb: { title: 'Búsqueda de instituciones', detail: lorem } },
    children: [
      { path: '', component: InstitucionesComponent },
      {
        path: 'new',
        data: { breadcrumb: { title: 'Nueva institución', detail: lorem } },
        component: NuevainstitucionComponent
      },
      {
        path: 'edit/:id',
        data: { breadcrumb: { title: 'Editar institución', detail: lorem } },
        component: EditarinstitucionComponent
      },
      {
        path: 'project-manager/:code',
        data: { breadcrumb: { title: 'Jefe de proyectos', detail: lorem } },
        component: JefeproyectosComponent
      },
      {
        path: 'new-project-manager/:code',
        data: { breadcrumb: { title: 'Nuevo jefe de proyectos', detail: lorem } },
        component: NuevojefeproyectosComponent
      },
      {
        path: 'edit-project-manager/:code/:id',
        data: { breadcrumb: { title: 'Editar jefe de proyectos', detail: lorem } },
        component: EditarjefeproyectosComponent
      },
      { path: '**', component: InstitucionesComponent },
    ]
  },
  {
    path: 'services',
    data: { breadcrumb: { title: 'Servicios', detail: lorem } },
    children: [
      { path: '', component: ServiciosComponent },
      {
        path: 'versions/:code',
        data: { breadcrumb: { title: 'Versiones', detail: lorem } },
        component: VersionesComponent
      },
      { path: '**', component: ServiciosComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
