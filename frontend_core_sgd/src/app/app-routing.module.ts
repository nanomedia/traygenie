import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [

  { path: '', component: InicioComponent },
  {
    path: '',
    loadChildren: () => import('./_modules/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '',
    loadChildren: () => import('./_modules/pages/temp.module').then(m => m.TempModule)
  },
  { path: '**', redirectTo: '/error', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
