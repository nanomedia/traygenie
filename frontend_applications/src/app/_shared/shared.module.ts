import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDemoComponent } from './components/app-demo/app-demo.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HelperModule } from '../_helpers/helper.module';
import { PopupTextValidateComponent } from './components/popup-text-validate/popup-text-validate.component';
import { PopupConfirmComponent } from './components/popup-confirm/popup-confirm.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';


const components = [
  AppDemoComponent,
  PopupTextValidateComponent,
  PopupConfirmComponent,
  LoadingSpinnerComponent
];

@NgModule({
  declarations: components,
  exports:components,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    HelperModule
  ]
})
export class SharedModule { }
