import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, registerLocaleData, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localPE from '@angular/common/locales/es-PE';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { MaterialModule } from './material/material.module';
import { PaginatorAdapter } from './_helpers/_adapters/paginator.adapter';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './_shared/header/header.component';
import { PopupComponent } from './_shared/popup/popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TOKEN_NAME } from './_shared/constants';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { ErrorComponent } from './pages/error/error.component';
import { LoadingComponent } from './_shared/loading/loading.component';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { DatosComponent } from './pages/datos/datos.component';


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
    MainComponent,
    HeaderComponent,
    PopupComponent,
    InicioComponent,
    ErrorComponent,
    LoadingComponent,
    DatosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
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
    PathLocationStrategy,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID, useValue: 'es-Pe'
    },
    { provide: MatPaginatorIntl, useValue: new PaginatorAdapter().getPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
