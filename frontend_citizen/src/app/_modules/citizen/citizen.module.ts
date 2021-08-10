import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitizenRoutingModule } from './citizen-routing.module';
import { AccesoDatosComponent } from './components/acceso-datos/acceso-datos.component';
import { DispositivosComponent } from './components/dispositivos/dispositivos.component';
import { InfoPersonalComponent } from './components/info-personal/info-personal.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    AccesoDatosComponent,
    DispositivosComponent,
    InfoPersonalComponent,
    InicioComponent
  ],
  imports: [
    CitizenRoutingModule,
    CommonModule,
    MaterialModule

  ]
})
export class CitizenModule { }
