import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from '../../material/material.module';
import { LoginComponent } from './components/auth/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ListAppComponent } from './components/list-app/list-app.component';
import { NewAppComponent } from './components/new-app/new-app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HelperModule } from 'src/app/_helpers/helper.module';

@NgModule({
  declarations: [
    LoginComponent,
    InicioComponent,
    ListAppComponent,
    NewAppComponent
  ],
  imports: [
    PagesRoutingModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    HelperModule
  ]
})
export class PagesModule { }
