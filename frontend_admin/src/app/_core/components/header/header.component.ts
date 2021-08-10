import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SecurityService } from '../../../_services/security.service';
import { BusyService } from '../../../_services/busy.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsuarioModel } from '../../../_models/usuario.model';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('drawer1') drawer1: MatDrawer;
  @Input('drawer') drawer: MatDrawer;

  title = "Portal de Instituciones";
  user: UsuarioModel | null;

  breadcrumb$: Observable<any[]>;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private bcService: BreadcrumbService,
    private _securityService: SecurityService,
    private _busyService: BusyService,
    private _router: Router) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.breadcrumb$ = this.bcService.breadcrumbs$;
    this.getUser();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  drawerToogle() {
    this.drawer.toggle();
  }

  drawerToogle1() {
    this.drawer1.toggle();
  }

  logout() {
    this._securityService.signOut();
    this._router.navigate(['/inicio']);
  }

  private getUser() {
    this._securityService.currentUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.user = x;
      if (this.user?.perfil == 'ADMIN') {
        this.title = "Portal Administrador";
      }
      else {
        (this.user?.perfil == 'INSTITUTION-USER')
        this.title = "Portal Instituciones";
      }
    });
  }

  

}


