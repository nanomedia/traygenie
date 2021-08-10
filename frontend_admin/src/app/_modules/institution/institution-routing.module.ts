import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsComponent } from './components/apps/apps.component';
import { DatosgeneralesComponent } from './components/datosgenerales/datosgenerales.component';
import { DeveloperComponent } from './components/developer/developer.component';
import { EditDeveloperComponent } from './components/edit-developer/edit-developer.component';
import { EditarAppComponent } from './components/editar-app/editar-app.component';
import { NewDeveloperComponent } from './components/new-developer/new-developer.component';


const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const routes: Routes = [
  {
    path: 'general',
    data: { breadcrumb: { title: 'Datos generales', detail: lorem } },
    component: DatosgeneralesComponent,
  },
  {
    path: 'apps',
    data: { breadcrumb: { title: 'Aplicaciones', detail: lorem } },
    children: [
      { path: '', component: AppsComponent },
      {
        path: 'edit/:id',
        data: { breadcrumb: { title: 'Editar aplicación', detail: lorem } },
        component: EditarAppComponent,
      },
    ]
  },

  {
    path: 'developer',
    data: { breadcrumb: { title: 'Desarrollador', detail: lorem } },
    children: [
      { path: '', component: DeveloperComponent },
      {
        path: 'new',
        data: { breadcrumb: { title: 'Nuevo desarrollador', detail: lorem } },
        component: NewDeveloperComponent
      },
      {
        path: 'edit/:id',
        data: { breadcrumb: { title: 'Editar desarrollador', detail: lorem } },
        component: EditDeveloperComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionRoutingModule { }
