import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { IdleService } from 'src/app/_services/idle.service';
import { IotClientService } from 'src/app/_services/iot-client.service';
import { SGDService } from 'src/app/_services/sgd.service';
import { IDGobPeConst } from 'src/app/_shared/constants';
import * as messages from '../../_shared/jsons/messages.json';

@Component({
  selector: 'app-message-one',
  templateUrl: './message-one.component.html',
  styleUrls: ['./message-one.component.scss']
})
export class MessageOneComponent implements OnInit {
  _IDGobPeConst: any;
  clientUri: SafeResourceUrl | null;
  currentSession: IVerifyTokenModel | null;
  dnieDevicePin: string;
  tokenDevicePin: string;

  private _unsubscribeAll: Subject<any>;

  /*
  Flags de inicio de los listeners
  */
  private _isProcessComplete: boolean;
  private _isProcessCancel: boolean;
  private _isInvalidCertificate: boolean;

  private messages: any[];

  currentScreen: string = 'main';


  constructor(
    private _idleService: IdleService,
    private _iotService: IotClientService,
    private _sanitizer: DomSanitizer,
    private _activatedRoute: ActivatedRoute,
    private _sgdService: SGDService) {

    this._IDGobPeConst = IDGobPeConst;
    this._unsubscribeAll = new Subject();
    this.getParams();

  }

  ngOnInit(): void {
    this.getCurrentSession();
    this.listenEvents();
    this.getDeviceMessage();
    this.onInterrupt();
  }

  onInterrupt() {
    this._idleService.hideLoader();
    this._idleService.onStop();
  }

  getDeviceMessage() {
    this.messages = (messages as any).default;
    this.dnieDevicePin = this.messages.find(msg => msg.code === "dnie_device_pin").message;
    this.tokenDevicePin = this.messages.find(msg => msg.code === "token_device_pin").message;
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
          this.currentScreen = 'processComplete';
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
          this.currentScreen = 'processCancel';
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
          this.currentScreen = 'invalidCertificate';
        }
        this._isInvalidCertificate = true;
      })
  }

  private async completeClient(code: string) {
    const response = await this._sgdService.postCompleteClient(code).toPromise();
    if (response?.success) {
      window.onbeforeunload = () => { }
      location.href = response.coreRedirect;
    }
  }

  private cancel() {
    window.onbeforeunload = () => { }
    let url = this._sgdService.cancelUri;
    this._sgdService.signOut();
    location.href = url;
    sessionStorage.clear();
  }

  private getCurrentSession() {
    this.currentSession = this._sgdService.getCurrentSession();
  }

  getParams() {

    this._activatedRoute.params
      .pipe(map(() => window.history.state))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        const clientUri = params?.clientUri ?? null;

        if (clientUri) {
          this.clientUri = this._sanitizer.bypassSecurityTrustResourceUrl(clientUri);
        }

      });
  }

}
