import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RPService } from '../../_services/rp.service';

@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.scss']
})
export class EndpointComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;

  private params: any | null;
  constructor(
    private _rpService: RPService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getParams();
    this.callEndPoint();
  }

  private getParams() {
    this._activatedRoute.queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        if (params) {
          this.params = params;
        }
      });
  }

  private async callEndPoint() {
    if (this.params === null) { return false; }
    if (this.params.error) {
      this._router.navigate(['viewer'], { state: { error: this.params } });
    }
    else {

      const data = await this._rpService.endpoint(this.params).toPromise();

      if (data) {
        this._router.navigate(['viewer'], { state: { endpoint: data } });
      } else {
        this._router.navigate(['inicio']);
      }
    }
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
