import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localPE from '@angular/common/locales/es-PE';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { TOKEN_NAME } from './_shared/constants';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { SharedModule } from './_shared/shared.module';
import { CoreModule } from './_core/core/core.module';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';


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
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    CoreModule,
    SharedModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BreadcrumbModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.ALLOWED_HOSTS,
        disallowedRoutes: [],
      }
    }),
    ...analiticsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    {
      provide: LOCALE_ID, useValue: 'es-Pe'
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
