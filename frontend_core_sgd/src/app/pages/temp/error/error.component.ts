import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SGDService } from 'src/app/_services/sgd.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {


  error: string | null;
  messageItem: any | null;

  private errors: any[] | null;
  private _unsubscribeAll: Subject<any>;

  constructor(
  ) {
    this.error = 'prueba'
  }

  cancel() {

  }

  ngOnInit(): void {


  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
