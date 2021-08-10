import { Platform } from '@angular/cdk/platform';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { BusyService } from 'src/app/_services/busy.service';

import { IotClientService } from 'src/app/_services/iot-client.service';
import { SGDService } from 'src/app/_services/sgd.service';
import { IDGobPeConst } from 'src/app/_shared/constants';
import * as messages from '../../_shared/jsons/messages.json';
import { environment } from '../../../environments/environment';
import { IdleService } from '../../_services/idle.service';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.component.html',
  styleUrls: ['./dispositivo.component.scss']
})
export class DispositivoComponent implements OnInit {

  _IDGobPeConst: any;
  isChecked = false;
  isLoading = false;
  isPressed = false;


  isMSIE: boolean = false;
  isChromeOpera: boolean;
  isFirefox: boolean;
  pluginUrl: string | null;
  legazyUrl: string | null;


  dnieDeviceTitle: string;
  dnieDeviceDescription: string;
  tokenDeviceDescription: string;

  private messages: any[];

  private _isValidatedCodeErrorInit: boolean;
  private _isValidatedCodeInit: boolean;

  private _unsubscribeAll: Subject<any>;

  currentSession: IVerifyTokenModel | null;

  constructor(

    private _iotService: IotClientService,
    private platform: Platform,
    private _busyService: BusyService,
    private _sgdService: SGDService,
    private _router: Router) {

    this._unsubscribeAll = new Subject();
    this._IDGobPeConst = IDGobPeConst;
    this.messages = (messages as any).default;
  }

  ngOnInit(): void {
    this.listenLoadingEvent();
    this.getCurrentSession();
    this.listenEvents();
    this.browserValidating();
    this.getDeviceMessage();

    if (this.isLegazy()) {
      this.continuar();
    }
  }

  changeToLegazy() {
    this._sgdService
      .getChangeToLegacy()
      .toPromise()
      .then(response => {
        if (response.success) {
          this._sgdService.cancelUri = response.cancelUri;
          this._sgdService.accessToken = response.token;
          this._sgdService.loadCurrentData();
          this.continuar();
        }
      });
  }

  getDeviceMessage() {
    this.dnieDeviceTitle = this.messages.find(msg => msg.code === "dnie_device_title").message;
    this.dnieDeviceDescription = this.messages.find(msg => msg.code === "dnie_device_description").message;
    this.tokenDeviceDescription = this.messages.find(msg => msg.code === "token_device_description").message;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  isLegazy() {
    const legazyArr = ["certificate_token_legacy", "certificate_dnie_legacy"];
    return legazyArr.some(item => item === this.currentSession.acr);
  }

  continuar() {
    this.isPressed = true;
    const token = this._sgdService.accessToken;
    this._iotService.setCode(token);
  }

  private listenEvents() {
    this._iotService.init();

    this._iotService.validatedCodeError$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        if (this._isValidatedCodeErrorInit) {
          console.log('validatedCodeError');
          this._sgdService.signOut();
          const code = 'validatedCodeError';
          this._router.navigate(['/error', code])
        }
        this._isValidatedCodeErrorInit = true;
      });


    this._iotService.validatedCode$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        if (this._isValidatedCodeInit) {
          console.log('validatedCodeInit')
          this.getClient();
        }
        this._isValidatedCodeInit = true;
      });
  }

  private async getClient() {

    const response = await this._sgdService.getClient().toPromise();
    if (response) {
      this._router.navigate(['/message'],
        { replaceUrl: true, state: { 'clientUri': response.clientUri } });
    }
  }

  private browserValidating() {
    if (navigator.userAgent.includes("Edg") || this.platform.TRIDENT) {
      this.isMSIE = true;
      this.continuar();
    }
    else if (this.platform.BLINK || this.platform.WEBKIT) {
      this.isChromeOpera = true;
      this.pluginUrl = 'https://chrome.google.com/webstore/detail/meta4-clickonce-launcher/jkncabbipkgbconhaajbapbhokpbgkdc?hl=es';
    }
    else if (this.platform.FIREFOX) {
      this.isFirefox = true;
      this.pluginUrl = 'https://addons.mozilla.org/es/firefox/addon/breez-clickonce/';
    }
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }


  private getCurrentSession() {
    this.currentSession = this._sgdService.getCurrentSession();
    this.legazyUrl = this._sgdService.changeAcrUri;
  }

  cancel() {
    window.onbeforeunload = () => { }
    this.isPressed = true;
    let url = this._sgdService.cancelUri;
    this._sgdService.signOut();
    location.href = url || environment.BASE_URL_DEFAULT_REDIRECT;
    sessionStorage.clear();
  }
}
