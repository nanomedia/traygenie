import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitutionRoutingModule } from './institution-routing.module';
import { AppsComponent } from './components/apps/apps.component';
import { DatosgeneralesComponent } from './components/datosgenerales/datosgenerales.component';
import { DeveloperComponent } from './components/developer/developer.component';
import { EditDeveloperComponent } from './components/edit-developer/edit-developer.component';
import { EditarAppComponent } from './components/editar-app/editar-app.component';
import { NewDeveloperComponent } from './components/new-developer/new-developer.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../_shared/shared.module';
import { HelperModule } from 'src/app/_helpers/helper.module';


@NgModule({
  declarations: [
    AppsComponent,
    DatosgeneralesComponent,
    DeveloperComponent,
    EditDeveloperComponent,
    EditarAppComponent,
    NewDeveloperComponent
  ],
  imports: [
    InstitutionRoutingModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HelperModule
  ]
})
export class InstitutionModule { }
