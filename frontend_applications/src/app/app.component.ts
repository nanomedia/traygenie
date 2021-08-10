import { Overlay } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { SecurityService } from './_services/security.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingSpinnerComponent } from './_shared/components/loading-spinner/loading-spinner.component';
import { BusyService } from './_services/busy.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
 
  private overlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any>;

  /**
    * Constructor
    */
  constructor(
    private _titleService:Title,
    private overlay: Overlay,
    private _authService: SecurityService,
    private _busyService: BusyService,
    private breadcrumbService: BreadcrumbService) {
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {
    this._titleService.setTitle(environment.APP_TITLE || '');
    this._authService.loadCurrentUser();
    this.listenLoadingEvent();
    this.createLoader();
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
