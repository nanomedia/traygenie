import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ClaveNacionalComponent } from '../../pages/clave-nacional/clave-nacional.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformModule } from '@angular/cdk/platform';
import { BasicoDirective } from 'src/app/_helpers/_directivas/basico.directive';
import { RouterModule } from '@angular/router';
import { DispositivoComponent } from 'src/app/pages/dispositivo/dispositivo.component';
import { DniComponent } from 'src/app/pages/dni/dni.component';
import { LoadingComponent } from 'src/app/pages/loading/loading.component';
import { MessageOneComponent } from 'src/app/pages/message-one/message-one.component';
import { Error400Component } from 'src/app/pages/error400/error400.component';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from "ng-recaptcha";
import { environment } from '../../../environments/environment';
import { AuthCancelComponent } from '../../pages/auth-cancel/auth-cancel.component';
import { AuthCompleteComponent } from '../../pages/auth-complete/auth-complete.component';
import { CertRevokedComponent } from '../../pages/cert-revoked/cert-revoked.component';
import { LoaderComponent } from '../../pages/loader/loader.component';

@NgModule({
  declarations: [
    BasicoDirective,
    ClaveNacionalComponent,
    DispositivoComponent,
    DniComponent,
    MessageOneComponent,
    LoadingComponent,
    Error400Component,
    AuthCancelComponent,
    AuthCompleteComponent,
    CertRevokedComponent,
    LoaderComponent    
  ],
  imports: [
    CommonModule,
    RouterModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    PlatformModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.RECAPTCHA_SITE_KEY } as RecaptchaSettings,
    },
  ]
})
export class PagesModule { }
