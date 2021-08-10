import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicoDirective } from './_directivas/basico.directive';


const helpers = [BasicoDirective]
@NgModule({
  declarations: helpers,
  exports: helpers,
  imports: [
    CommonModule
  ]
})
export class HelperModule { }
