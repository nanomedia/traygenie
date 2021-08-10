import { Component, OnInit } from '@angular/core';
import { SecurityService } from './_services/security.service';
import { BusyService } from './_services/busy.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Subject } from 'rxjs';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { takeUntil } from 'rxjs/operators';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingSpinnerComponent } from './_shared/components/loading-spinner/loading-spinner.component';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private overlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any>;

  constructor(
    
    private _titleService: Title,
    private overlay: Overlay,
    private breadcrumbService: BreadcrumbService,
    private _busyService: BusyService,
    private _securityService: SecurityService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._titleService.setTitle(environment.APP_TITLE || '');
    this._securityService.loadCurrentUser();
    this.createLoader();
    this.listenLoadingEvent();
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(isLoading => {
      if (isLoading) this.show();
      else this.hide();
    });
  }

  private createLoader() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global(),
      hasBackdrop: true
    })
  }

  private show() {
    this.overlayRef?.detach();
    this.overlayRef?.attach(new ComponentPortal(LoadingSpinnerComponent));
  }

  private hide() {
    this.overlayRef?.detach();
  }
}
