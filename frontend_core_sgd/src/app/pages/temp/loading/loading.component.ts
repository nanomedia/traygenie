import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { SGDService } from 'src/app/_services/sgd.service';
import { IDGobPeConst } from 'src/app/_shared/constants';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private token: string | null;

  constructor(
    private _router: Router,
    private _sgdService: SGDService,
    private _activatedRoute: ActivatedRoute) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    
  }

  

  


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
