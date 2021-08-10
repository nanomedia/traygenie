import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SGDService } from './_services/sgd.service';
import { IDGobPeConst } from './_shared/constants';
import { environment } from '../environments/environment';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TimerComponent } from './_shared/timer/timer.component';
import { IdleService } from './_services/idle.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  private overlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _router:Router,
    private deviceService: DeviceDetectorService,
    private _idleService: IdleService,
    private _titleService: Title,
    private overlay: Overlay,
    private _service: SGDService) {
    this._service.loadCurrentData();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._titleService.setTitle(environment.APP_TITLE || '');

    if (this.deviceService.isDesktop()) {
      this.listenWindowEvents();
      this.idelInit();
      this.showEvent();
    } else {
      this._router.navigate(['/error', 'restriccion_acr_device']);
    }
  }

  private idelInit() {
    this._idleService.idleInit();

    this._idleService
      .onIdleEnd()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this._idleService.hideLoader());

    this._idleService
      .onIdleStart()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this._idleService.showLoader());
  }

  private listenWindowEvents() {
    if (window.opener && window.opener !== window) {
      window.opener.postMessage({ event: IDGobPeConst.EVENT_LOADED }, '*');
      window.onbeforeunload = () => {
        window.opener.postMessage({ event: IDGobPeConst.EVENT_CANCEL }, '*');
      }
    }
  }

  private createLoader() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global(),
      hasBackdrop: true
    })
  }

  private showEvent() {
    this._idleService.showLoader$.subscribe(show => {
      if (show) {
        this.show();
      } else {
        this.hide();
      }
    })
  }

  private show() {
    this.createLoader();
    this.overlayRef?.attach(new ComponentPortal(TimerComponent));
  }

  private hide() {
    this.overlayRef?.dispose();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
