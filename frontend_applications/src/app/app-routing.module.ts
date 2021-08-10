import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './_core/components/layout/layout.component';
import { MainGuard } from './_guards/main.guard';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./_modules/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'main',
        canActivate: [MainGuard],
        canActivateChild: [MainGuard],
        data: { roles: ['APP-USER'] },
        loadChildren: () => import('./_modules/main/main.module').then(m => m.MainModule),
      }
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login-redirect' },
  { path: 'login-redirect', pathMatch: 'full', redirectTo: 'lista' },

]

@NgModule(
  {
    imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules, })],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
