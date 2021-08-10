import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { InicioComponent } from './components/inicio/inicio.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
  ]
})
export class PagesModule { }
