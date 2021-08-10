import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { TOKEN_NAME } from './_shared/constants';

import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { AuthInterceptor } from './_interceptors/auth.interceptor';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorAdapter } from './_helpers/_adapters/paginator.adapter';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';


import localPE from '@angular/common/locales/es-PE';
import { CoreModule } from './_core/core.module';

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
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.ALLOWED_HOSTS,
        // allowedDomains: [environment.ALLOWED_HOST_ADMIN],
        disallowedRoutes: [],
      },
      ...analiticsModule
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-Pe' },
    { provide: MatPaginatorIntl, useValue: new PaginatorAdapter().getPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
