import { NgModule } from '@angular/core';
import { InicioComponent } from './components/inicio/inicio.component';
import { ListAppComponent } from './components/list-app/list-app.component';
import { NewAppComponent } from './components/new-app/new-app.component';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from 'src/app/_guards/noAuth.guard';
import { MainGuard } from 'src/app/_guards/main.guard';
import { AlterLayoutComponent } from '../../_core/components/alter-layout/alter-layout.component';


// Búsqueda de aplicaciones
const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const routes: Routes = [

  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [NoAuthGuard],
  },

  {
    path: '',
    component: AlterLayoutComponent,
    children: [
      {
        path: 'lista',
        component: ListAppComponent,

        canActivate: [MainGuard],
        data: {roles: ['APP-USER'], breadcrumb: { title: "Búsqueda de aplicaciones", detail: lorem } },
      },
      {
        path: 'new-app',
        component: NewAppComponent,
        canActivate: [MainGuard],
        data: {roles: ['APP-USER'], breadcrumb: { title: "Nueva aplicación", detail: lorem } },
      }
    ]
  }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
