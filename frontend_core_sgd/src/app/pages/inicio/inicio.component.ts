
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { _Schedule } from '@angular/cdk/table';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;


  constructor(private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this._activatedRoute.queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        const token = params.token ?? null;
        this._router.navigate(['/loading'], {
          state: { token }
        });
      });
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
