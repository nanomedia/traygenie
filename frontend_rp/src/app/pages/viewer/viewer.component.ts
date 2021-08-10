import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BusyService } from '../../_services/busy.service';
import { environment } from '../../../environments/environment';

declare const IDGobPe: any;

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {

  tokenData: any | null;
  endpointData: any | null;
  errorData: any | null;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _busyService:BusyService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getQueryParam();
    this.check();
  }

  check() {
    if (!this.tokenData && !this.endpointData && !this.errorData) {
      this.cancel();
    }
  }

  cancel() {
    IDGobPe.logout(environment.BASE_URL);
  }

  private getQueryParam() {
    this._busyService.hide();
    this._activatedRoute.params
      .pipe(map(() => window.history.state))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        if (params.token) {
          this.tokenData = params.token;
        }
        else if (params.endpoint) {
          this.endpointData = params.endpoint;
        }
        else if (params.error) {
          this.errorData = params.error;
        }
      });
  }

}
