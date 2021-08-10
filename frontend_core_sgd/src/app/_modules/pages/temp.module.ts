import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TempRoutingModule } from './temp-routing.module';

import { MaterialModule } from 'src/app/material/material.module';

import { ClaveNacionalComponent } from 'src/app/pages/temp/clave-nacional/clave-nacional.component';
import { AuthCompleteComponent } from 'src/app/pages/temp/auth-complete/auth-complete.component';
import { AuthCancelComponent } from 'src/app/pages/temp/auth-cancel/auth-cancel.component';
import { CertRevokedComponent } from 'src/app/pages/temp/cert-revoked/cert-revoked.component';
import { ClientRedirectComponent } from 'src/app/pages/temp/client-redirect/client-redirect.component';
import { DispositivoTokenComponent } from 'src/app/pages/temp/dispositivo-token/dispositivo-token.component';
import { UnsupportedDeviceComponent } from 'src/app/pages/temp/unsupported-device/unsupported-device.component';
import { DispositivocargaComponent } from 'src/app/pages/temp/dispositivocarga/dispositivocarga.component';




import { DniComponent } from 'src/app/pages/temp/dni/dni.component';
import { ErrorComponent } from 'src/app/pages/temp/error/error.component';
import { LoadingComponent } from 'src/app/pages/temp/loading/loading.component';
import { MessageOneComponent } from 'src/app/pages/temp/message-one/message-one.component';
import { Error400Component } from 'src/app/pages/temp/error400/error400.component';
import { DispositivoTempComponent } from 'src/app/pages/temp/dispositivo-temp/dispositivo-temp.component';
import { RouterModule } from '@angular/router';
import { PlatformModule } from '@angular/cdk/platform';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatosComponent } from 'src/app/pages/temp/datos/datos.component';

@NgModule({
  declarations: [
    ClaveNacionalComponent,
    DispositivoTempComponent,
    DniComponent,
    MessageOneComponent,
    ErrorComponent,
    LoadingComponent,
    Error400Component,
    AuthCompleteComponent,
    AuthCancelComponent,
    CertRevokedComponent,
    ClientRedirectComponent,
    DispositivoTokenComponent,
    UnsupportedDeviceComponent,
    DispositivocargaComponent,
    DatosComponent,
  ],
  imports: [

    CommonModule,
    TempRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    PlatformModule
  ]
})
export class TempModule { }
