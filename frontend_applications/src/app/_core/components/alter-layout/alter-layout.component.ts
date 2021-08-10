import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/_services/security.service';
import { BusyService } from 'src/app/_services/busy.service';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/_models/usuario.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-alter-layout',
  templateUrl: './alter-layout.component.html',
  styleUrls: ['./alter-layout.component.scss']
})
export class AlterLayoutComponent implements OnInit {

  user: UsuarioModel | null;
  breadcrumb$: Observable<any[]>;
  isLoading = false;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private bcService: BreadcrumbService,
    private _securityService: SecurityService,
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

  private getUser() {
    this._securityService.currentUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.user = x;
    });
  }

  logout() {
    this._securityService.signOut();
    this._router.navigate(['/inicio']);
  }
}
