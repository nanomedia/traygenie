import { LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
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
import { PersonaComponent } from './pages/main/persona/persona.component';
import { InicioComponent } from './pages/inicio/inicio.component';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { EndpointComponent } from './pages/endpoint/endpoint.component';
import { LoadingSpinnerComponent } from './_shared/loading-spinner/loading-spinner.component';
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
    AppComponent,
    MainComponent,
    HeaderComponent,
    PopupComponent,
    PersonaComponent,
    InicioComponent,
    ViewerComponent,
    EndpointComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxJsonViewerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: environment.ALLOWED_HOSTS,
        disallowedRoutes: [],
      }
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    analiticsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-Pe' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
