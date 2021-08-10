import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-unsupported-device',
  templateUrl: './unsupported-device.component.html',
  styleUrls: ['./unsupported-device.component.scss']
})
export class UnsupportedDeviceComponent implements OnInit {

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
