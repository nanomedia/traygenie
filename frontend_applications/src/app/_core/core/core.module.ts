import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../_core/components/header/header.component';
import { LayoutComponent } from '../../_core/components/layout/layout.component';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { AlterLayoutComponent } from '../components/alter-layout/alter-layout.component';


const components = [
  HeaderComponent,
  LayoutComponent,
  AlterLayoutComponent
]
@NgModule({
  declarations: [components],
  exports: [components],
  imports: [
    RouterModule,
    MaterialModule,
    CommonModule
  ]
})
export class CoreModule { }
