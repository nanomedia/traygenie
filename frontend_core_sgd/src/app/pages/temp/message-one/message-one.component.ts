import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IotClientService } from 'src/app/_services/iot-client.service';
import { SGDService } from 'src/app/_services/sgd.service';

@Component({
  selector: 'app-message-one',
  templateUrl: './message-one.component.html',
  styleUrls: ['./message-one.component.scss']
})
export class MessageOneComponent implements OnInit {

  clientUri: SafeResourceUrl | null;
  private _unsubscribeAll: Subject<any>;

  /*
  Flags de inicio de los listeners
  */
  private _isProcessComplete: boolean;
  private _isProcessCancel: boolean;
  private _isInvalidCertificate: boolean;

  constructor(
    private _iotService: IotClientService,
    private _sanitizer: DomSanitizer,
    private _activatedRoute: ActivatedRoute,
    private _sgdService: SGDService, private _router: Router) {

    this._unsubscribeAll = new Subject();
    
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private listenEvents() {

    this._iotService.processComplete$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        if (this._isProcessComplete) {
          console.log('processComplete');
          if (response?.code) {
            this.completeClient(response?.code);
          }
        }
        this._isProcessComplete = true;

      })

    this._iotService.processCancel$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        if (this._isProcessCancel) {
          console.log('processCancel')
          this.cancel();
        }
        this._isProcessCancel = true;
      })
    this._iotService.invalidCertificate$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        if (this._isInvalidCertificate) {
          console.log('invalidCertificate')
          this._router.navigate(['/error'], { queryParams: { 'error': 'invalidCertificate' } })
        }
        this._isInvalidCertificate = true;
      })
  }

  private async completeClient(code: string) {
    
  }

  private cancel() {
    
  }

  getParams() {

  }

}
