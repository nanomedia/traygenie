import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PopupConfirmComponent } from './components/popup-confirm/popup-confirm.component';
import { PopupTextValidateComponent } from './components/popup-text-validate/popup-text-validate.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

const components = [
  PopupConfirmComponent,
  PopupTextValidateComponent,
  LoadingSpinnerComponent
]

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
