import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaveNacionalComponent } from '../../pages/clave-nacional/clave-nacional.component';

import { MainGuard } from 'src/app/_guards/main.guard';
import { DispositivoComponent } from 'src/app/pages/dispositivo/dispositivo.component';
import { DniComponent } from 'src/app/pages/dni/dni.component';
import { LoadingComponent } from 'src/app/pages/loading/loading.component';
import { MessageOneComponent } from 'src/app/pages/message-one/message-one.component';
import { Error400Component } from 'src/app/pages/error400/error400.component';

const routes: Routes = [
  { path: 'loading', component: LoadingComponent },
  {
    path: 'dni',
    component: DniComponent,
    canActivate: [MainGuard],
    data: { roles: ['one_factor'] }
  },
  {
    path: 'clave',
    component: ClaveNacionalComponent,
    canActivate: [MainGuard],
    data: { roles: ['one_factor'] },
  },
  {
    path: 'dispositivo',
    component: DispositivoComponent,
    data: {
      roles: ['certificate_dnie', 'certificate_token','certificate_dnie_legacy', 'certificate_token_legacy']
    },
    canActivate: [MainGuard],
  },
  {
    path: 'message', component: MessageOneComponent,
    data: {
      roles: ['certificate_dnie', 'certificate_token',
        'certificate_dnie_legacy', 'certificate_token_legacy']
    },
    canActivate: [MainGuard],
  },
  { path: 'error/:code', component: Error400Component },


  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
