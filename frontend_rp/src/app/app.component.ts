import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from './_services/busy.service';
import { LoadingSpinnerComponent } from './_shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private overlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any>;



  constructor(
    private overlay: Overlay,
    private _busyService: BusyService) {

    this._unsubscribeAll = new Subject();

  }

  
  ngOnInit(): void {
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
