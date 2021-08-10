import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MaterialModule } from '../../material/material.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorAdapter } from 'src/app/_helpers/_adapters/paginator.adapter';
import { AgenteAutomatizadoComponent } from './components/agente-automatizado/agente-automatizado.component';
import { AutentificacionDigitalComponent } from './components/autentificacion-digital/autentificacion-digital.component';
import { AvanzadoComponent } from './components/avanzado/avanzado.component';
import { FirmaDigitalComponent } from './components/firma-digital/firma-digital.component';
import { InicioAppComponent } from './components/inicio-app/inicio-app.component';
import { ValidacionFirmaComponent } from './components/validacion-firma/validacion-firma.component';
import { SharedModule } from '../../_shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseComponent } from './components/base/base.component';
import { DisableServiceComponent } from './components/disable-service/disable-service.component';
import { EnableServiceComponent } from './components/enable-service/enable-service.component';
import { CredentialPanelComponent } from './components/credential-panel/credential-panel.component';
import { NewCredentialPanelComponent } from './components/new-credential-panel/new-credential-panel.component';

@NgModule({
  declarations: [
    BaseComponent,
    AgenteAutomatizadoComponent,
    AutentificacionDigitalComponent,
    AvanzadoComponent,
    FirmaDigitalComponent,
    ValidacionFirmaComponent,
    InicioAppComponent,
    DisableServiceComponent,
    EnableServiceComponent,
    CredentialPanelComponent,
    NewCredentialPanelComponent
  ],
  imports: [
    MainRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    DatePipe,
    { provide: MatPaginatorIntl, useValue: new PaginatorAdapter().getPaginatorIntl() }]
})
export class MainModule { }
