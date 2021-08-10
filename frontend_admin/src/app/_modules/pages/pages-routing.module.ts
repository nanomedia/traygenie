import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainGuard } from 'src/app/_guards/main.guard';
import { NoAuthGuard } from 'src/app/_guards/noAuth.guard';
import { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [
  {
    path: 'inicio', component: InicioComponent,
    canActivate: [NoAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
