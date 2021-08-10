import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localPE from '@angular/common/locales/es-PE';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { PaginatorAdapter } from './_helpers/_adapters/paginator.adapter';
import { AppRoutingModule } from './app-routing.module';
import { TOKEN_NAME } from './_shared/constants';
import { CoreModule } from './_core/core.module';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { SharedModule } from './_shared/shared.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { environment } from 'src/environments/environment';


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
    CoreModule,
    SharedModule,
    AppRoutingModule,
    BreadcrumbModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // allowedDomains: environment.ALLOWED_HOSTS,
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
    { provide: MatPaginatorIntl, useValue: new PaginatorAdapter().getPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
