import { Component, HostListener, OnInit } from '@angular/core';
import { IdleService } from '../../_services/idle.service';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SGDService } from '../../_services/sgd.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  private timerSubject = new BehaviorSubject<number>(120);
  private _unsubscribeAll: Subject<any>;

  innerWidth: string = '0px';
  timer$ = this.timerSubject.asObservable();

  constructor(
    private _sgdService: SGDService,
    private _idleService: IdleService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth + 'px';

    this._idleService
      .onTimeoutWarning()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((num) => {
        this.timerSubject.next(num);
      });

    this._idleService.onTimeout()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.cancel();
      })
  }

  cancel() {
    window.onbeforeunload = () => { }
    let url = this._sgdService.cancelUri;
    this._sgdService.signOut();
    sessionStorage.clear();
    location.href = url || environment.BASE_URL_DEFAULT_REDIRECT;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth + 'px';
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}


