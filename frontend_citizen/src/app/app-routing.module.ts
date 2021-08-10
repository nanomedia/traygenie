import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './_core/components/layout/layout.component';
import { MainGuard } from './_guards/main.guard';
import { NoAuthGuard } from './_guards/noAuth.guard';


const routes: Routes = [

  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    loadChildren: () => import('./_modules/page/page.module').then(m => m.PageModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'citizen',
        canActivate: [MainGuard],
        canActivateChild: [MainGuard],
        loadChildren: () => import('./_modules/citizen/citizen.module').then(m => m.CitizenModule),
      }
    ]
  },
  
  { path: '**', pathMatch: 'full', redirectTo: 'login-redirect' },
  { path: 'login-redirect', pathMatch: 'full', redirectTo: 'citizen/inicio' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
