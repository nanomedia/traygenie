import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { EndpointComponent } from './pages/endpoint/endpoint.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'viewer', component: ViewerComponent },
  { path: 'endpoint', component: EndpointComponent },  
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
