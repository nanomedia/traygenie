import { Injectable } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdleService {

  private showLoaderSubject = new BehaviorSubject<boolean>(false);
  showLoader$ = this.showLoaderSubject.asObservable();

  constructor(public idle: Idle) { }

  showLoader() {
    this.showLoaderSubject.next(true);
  }

  hideLoader() {
    this.showLoaderSubject.next(false);

  }

  idleInit() {
    this.idle.setIdle(environment.AUTH_TIME_IDLE);
    this.idle.setTimeout(environment.AUTH_TIME_OUT);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.watch();
  }

  onIdleEnd() {
    return this.idle.onIdleEnd;
  }

  onTimeout() {
    return this.idle.onTimeout;
  }
  onTimeoutWarning() {
    return this.idle.onTimeoutWarning;
  }

  onIdleStart() {
    return this.idle.onIdleStart;
  }

  onStop() {
    return this.idle.stop();
  }

}
