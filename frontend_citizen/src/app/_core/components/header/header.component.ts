import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioModel } from 'src/app/_models/usuario.model';
import { Observable, Subject } from 'rxjs';
import { SecurityService } from 'src/app/_services/security.service';
import { BusyService } from 'src/app/_services/busy.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BreadcrumbService } from 'xng-breadcrumb';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('drawer1') drawer1: MatDrawer;

  @Input('drawer') drawer: MatDrawer;

  user: UsuarioModel | null;
  breadcrumb$: Observable<any[]>;
  appName: string | null;
  
  private _unsubscribeAll: Subject<any>;

  constructor(
    private bcService: BreadcrumbService,
    private _securityService: SecurityService,
    private _busyService: BusyService,
    private _router: Router) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getUser();
    this.breadcrumb$ = this.bcService.breadcrumbs$;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private getUser() {
    this._securityService.currentUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.user = x;
    });
  }

  logout() {
    this._securityService.signOut();
    this._router.navigate(['/inicio']);
  }

  drawerToogle() {
    this.drawer.toggle();
  }

  drawerToogle1() {
    this.drawer1.toggle();
  }

}
