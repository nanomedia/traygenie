import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AppDemoComponent } from 'src/app/_shared/components/app-demo/app-demo.component';
import { UsuarioModel } from 'src/app/_models/usuario.model';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { SecurityService } from 'src/app/_services/security.service';
import { BusyService } from 'src/app/_services/busy.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ApplicationService } from '../../../_services/application.service';


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
    private dialog: MatDialog,
    private bcService: BreadcrumbService,
    private _securityService: SecurityService,
    private _appService: ApplicationService,
    private _busyService: BusyService,
    private _router: Router) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.breadcrumb$ = this.bcService.breadcrumbs$;
    this.getUser();
    this.getAppName();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.dialog?.closeAll();
  }

  private getUser() {
    this._securityService.currentUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.user = x;
    });
  }

  private getAppName() {

    this._appService
      .getCurrentApp()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(app => {
        this.appName = app?.name ?? null;
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

  app() {
    this.dialog?.open(AppDemoComponent, {
      width: '98%',
      maxWidth: '850px'
    });
  }
}
