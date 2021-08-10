import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localPE from '@angular/common/locales/es-PE';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './_interceptors/auth.interceptor';

import { PaginatorAdapter } from './_helpers/_adapters/paginator.adapter';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TOKEN_NAME } from './_shared/constants';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { LoadingInterceptor } from './_services/loading.interceptor';
import { MaterialModule } from './material/material.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';
import { TimerComponent } from './_shared/timer/timer.component';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';


const config: SocketIoConfig = { url: environment.BASE_URL_SERVICE_CORE_SGD_WEBSOCKET, options: {} };

export function tokenGetter() {
  return sessionStorage.getItem(TOKEN_NAME);
}

registerLocaleData(localPE, 'es-Pe');

const analiticsModule = [];
if (environment.ANALYTICS_ID && environment.ANALYTICS_ID !== '') {
  analiticsModule.push(NgxGoogleAnalyticsModule.forRoot(environment.ANALYTICS_ID));
}


@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SocketIoModule.forRoot(config),
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.ALLOWED_HOSTS,
        // allowedDomains: [environment.ALLOWED_HOST_ADMIN],
        disallowedRoutes: [],
      }
    }),
    ...analiticsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    },
    {
      provide: LOCALE_ID, useValue: 'es-Pe'
    },
    { provide: MatPaginatorIntl, useValue: new PaginatorAdapter().getPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
