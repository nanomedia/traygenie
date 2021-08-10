import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './_core/components/layout/layout.component';
import { MainGuard } from './_guards/main.guard';

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: '/inicio' },

  { path: 'admin-redirect', pathMatch: 'full', redirectTo: '/admin/institutions' },
  { path: 'institution-redirect', pathMatch: 'full', redirectTo: '/institution/general' },

  {
    path: '',    
    loadChildren: () => import('./_modules/pages/pages.module').then(m => m.PagesModule)
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'admin',
        canActivate: [MainGuard],
        canActivateChild: [MainGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./_modules/admin/admin.module').then(m => m.AdminModule),
      }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'institution',
        canActivate: [MainGuard],
        canActivateChild: [MainGuard],
        data: { roles: ['INSTITUTION-USER'] },
        loadChildren: () => import('./_modules/institution/institution.module').then(m => m.InstitutionModule),
      }
    ]
  },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' }
]


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }



// const routes: Routes = [

//   { path: 'inicio', component: InicioComponent, canActivate: [NoAuthGuard] },

//   { path: '', pathMatch: 'full', redirectTo: 'main' },

//   { path: 'login-redirect', pathMatch: 'full', redirectTo: 'main' },
//   {
//     path: 'main', component: MainComponent,
//     data: { roles: ['ADMIN', 'INSTITUTION-USER'] },
//     canActivate: [MainGuard],
//     canActivateChild: [MainGuard],
//     children: [
//          {
//         path: 'instituciones', component: InstitucionesComponent,
//         data: { breadcrumb: 'Instituciones', roles: ['ADMIN'] }
//       },
//       {
//         path: 'nuevainstitucion', component: NuevainstitucionComponent,
//         data: { breadcrumb: 'Nueva institución', roles: ['ADMIN'] }
//       },
//       {
//         path: 'editarinstitucion', component: EditarinstitucionComponent,
//         data: { breadcrumb: 'Editar institución', roles: ['ADMIN'] }
//       },
//       {
//         path: 'servicios', component: ServiciosComponent,
//         data: { breadcrumb: 'Servicios', roles: ['ADMIN'] }
//       },
//       {
//         path: 'versiones', component: VersionesComponent,
//         data: { breadcrumb: 'Versiones', roles: ['ADMIN'] }
//       },
//       {
//         path: 'jefeproyectos', component: JefeproyectosComponent,
//         data: { breadcrumb: 'Jefes de proyectos', roles: ['ADMIN'] }
//       },
//       {
//         path: 'nuevo_jefe_proyectos', component: NuevojefeproyectosComponent,
//         data: { breadcrumb: 'Nuevo jefe de proyectos', roles: ['ADMIN'] }
//       },
//       {
//         path: 'editar_jefe_proyectos', component: EditarjefeproyectosComponent,
//         data: { breadcrumb: 'Editar jefe de proyectos', roles: ['ADMIN'] }
//       },

//       {
//         path: 'datos-generales', component: DatosgeneralesComponent,
//         data: { breadcrumb: 'Datos Generales', roles: ['INSTITUTION-USER'] }
//       },
//       {
//         path: 'apps', component: AppsComponent,
//         data: { breadcrumb: 'Aplicaciones', roles: ['INSTITUTION-USER'] }
//       },
//       {
//         path: 'editar-app', component: EditarAppComponent,
//         data: { breadcrumb: 'Editar aplicación', roles: ['INSTITUTION-USER'] }
//       },
//       {
//         path: 'developer', component: DeveloperComponent,
//         data: { breadcrumb: 'Desarrolladores', roles: ['INSTITUTION-USER'] }
//       },
//       {
//         path: 'new-developer', component: NewDeveloperComponent,
//         data: { breadcrumb: 'Nuevo desarrollador', roles: ['INSTITUTION-USER'] }
//       },
//       {
//         path: 'edit-developer', component: EditDeveloperComponent,
//         data: { breadcrumb: 'Editar desarrollador', roles: ['INSTITUTION-USER'] }
//       }

//     ]
//   },
//   { path: '**', redirectTo: 'inicio', pathMatch: 'full' }
// ]
