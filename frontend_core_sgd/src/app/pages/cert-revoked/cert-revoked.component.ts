import { Component, OnInit } from '@angular/core';
import * as messages from '../../_shared/jsons/messages.json';
import { IDGobPeConst } from 'src/app/_shared/constants';
import { SGDService } from 'src/app/_services/sgd.service';
import { IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { environment } from '../../../environments/environment';
import { IdleService } from 'src/app/_services/idle.service';

@Component({
  selector: 'app-cert-revoked',
  templateUrl: './cert-revoked.component.html',
  styleUrls: ['./cert-revoked.component.scss']
})
export class CertRevokedComponent implements OnInit {

  private messages: any[];

  _IDGobPeConst: any;
  dnieDeviceRevoked: string;
  tokenDeviceRevoked: string;
  currentSession: IVerifyTokenModel | null;

  constructor(
    private _idleService:IdleService,
    private _sgdService: SGDService) {
    this._IDGobPeConst = IDGobPeConst;
    this.getDeviceMessage();
    this.getCurrentSession();
  }

  ngOnInit(): void { 
    this._idleService.idleInit();
    this._idleService.onIdleStart();
  }

  getDeviceMessage() {
    this.messages = (messages as any).default;
    this.dnieDeviceRevoked = this.messages.find(msg => msg.code === "dnie_device_revoked").message;
    this.tokenDeviceRevoked = this.messages.find(msg => msg.code === "token_device_revoked").message;
  }

  cancel() {
    const url = this.currentSession?.cancelUri || environment.BASE_URL_DEFAULT_REDIRECT;
    location.href = url;
  }

  private getCurrentSession() {
    this.currentSession = this._sgdService.getCurrentSession();
  }
}
