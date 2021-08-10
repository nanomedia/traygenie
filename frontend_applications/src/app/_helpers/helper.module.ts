import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicoDirective } from './_directivas/basico.directive';


const components = [BasicoDirective];
@NgModule({
  declarations: components,
  imports: [
    CommonModule
  ],
  exports: components
})
export class HelperModule { }
