import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    LoadingSpinnerComponent
  ],
  exports:[
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
