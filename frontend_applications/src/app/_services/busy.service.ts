import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  private loading$ = new BehaviorSubject<boolean>(false);
  loading = this.loading$.asObservable();
  busyRequestCount = 0;

  busy() {
    this.busyRequestCount++;
    this.loading$.next(true);
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.loading$.next(false);
    }
  }

  show() {
    this.loading$.next(true);
  }
  
  hide() { 
    this.loading$.next(false);
  }
}
