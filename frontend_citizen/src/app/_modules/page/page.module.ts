import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { InicioComponent } from './components/inicio/inicio.component';
import { MaterialModule } from '../../material/material.module';


@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    MaterialModule
  ]
})
export class PageModule { }
