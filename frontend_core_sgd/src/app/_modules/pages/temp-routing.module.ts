import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaveNacionalComponent } from 'src/app/pages/temp/clave-nacional/clave-nacional.component';
import { DniComponent } from 'src/app/pages/temp/dni/dni.component';
import { AuthCompleteComponent } from 'src/app/pages/temp/auth-complete/auth-complete.component';
import { AuthCancelComponent } from 'src/app/pages/temp/auth-cancel/auth-cancel.component';
import { CertRevokedComponent } from 'src/app/pages/temp/cert-revoked/cert-revoked.component';
import { ClientRedirectComponent } from 'src/app/pages/temp/client-redirect/client-redirect.component';
import { DispositivoTokenComponent } from 'src/app/pages/temp/dispositivo-token/dispositivo-token.component';
import { ErrorComponent } from 'src/app/pages/temp/error/error.component';
import { LoadingComponent } from 'src/app/pages/temp/loading/loading.component';
import { MessageOneComponent } from 'src/app/pages/temp/message-one/message-one.component';
import { Error400Component } from 'src/app/pages/temp/error400/error400.component';
import { DispositivoTempComponent } from 'src/app/pages/temp/dispositivo-temp/dispositivo-temp.component';
import { UnsupportedDeviceComponent } from 'src/app/pages/temp/unsupported-device/unsupported-device.component';
import { DispositivocargaComponent } from 'src/app/pages/temp/dispositivocarga/dispositivocarga.component';
import { DatosComponent } from 'src/app/pages/temp/datos/datos.component';

const routes: Routes = [
  {
    path: 'temp', children: [
      { path: 'loading', component: LoadingComponent },
      { path: 'dni', component: DniComponent },
      { path: 'clave', component: ClaveNacionalComponent },
      { path: 'dispositivo', component: DispositivoTempComponent, },
      { path: 'message', component: MessageOneComponent },
      { path: 'error', component: ErrorComponent },
      { path: 'error_404', component: Error400Component },
      { path: 'pantalla', component: AuthCompleteComponent },
      { path: 'cancelacion', component: AuthCancelComponent },
      { path: 'revocado', component: CertRevokedComponent },
      { path: 'redirect', component: ClientRedirectComponent },
      { path: 'dispositivotoken', component: DispositivoTokenComponent },
      { path: 'dispositivo2', component: UnsupportedDeviceComponent },
      { path: 'dispositivocarga', component: DispositivocargaComponent },
      { path: 'datos', component: DatosComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TempRoutingModule { }



// Direcciones locales:
// ***********************************
// http://localhost:4200/#/temp/loading
// http://localhost:4200/#/temp/dni
// http://localhost:4200/#/temp/clave
// http://localhost:4200/#/temp/dispositivo
// http://localhost:4200/#/temp/message
// http://localhost:4200/#/temp/error
// http://localhost:4200/#/temp/error_404
// ************************************
//Localizacion \frontend_core_sgd\src\app\pages\temp'
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/loading
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/dni
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/clave
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/dispositivo
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/message
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/error
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/error_404
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/pantalla
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/cancelacion
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/revocado
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/redirect
// https://core-sgd-dev.idgobpe.dev.servicios.gob.pe/#/temp/dispositivotoken
