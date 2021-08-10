import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { EditarinstitucionComponent } from './components/editarinstitucion/editarinstitucion.component';
import { EditarjefeproyectosComponent } from './components/editarjefeproyectos/editarjefeproyectos.component';
import { InstitucionesComponent } from './components/instituciones/instituciones.component';
import { JefeproyectosComponent } from './components/jefeproyectos/jefeproyectos.component';
import { NuevainstitucionComponent } from './components/nuevainstitucion/nuevainstitucion.component';
import { NuevojefeproyectosComponent } from './components/nuevojefeproyectos/nuevojefeproyectos.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { VersionesComponent } from './components/versiones/versiones.component';
import { VersionComponent } from './components/version/version.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_shared/shared.module';
import { HelperModule } from 'src/app/_helpers/helper.module';
import { MaterialModule } from '../../material/material.module';
import { AuthInterceptor } from 'src/app/_interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  declarations: [
    EditarinstitucionComponent,
    EditarjefeproyectosComponent,
    InstitucionesComponent,
    JefeproyectosComponent,
    NuevainstitucionComponent,
    NuevojefeproyectosComponent,
    ServiciosComponent,
    VersionesComponent,
    VersionComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HelperModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, }],
})
export class AdminModule { }
