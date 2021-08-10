import { Component, OnInit } from '@angular/core';
import { IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { SGDService } from 'src/app/_services/sgd.service';
import * as messages from '../../_shared/jsons/messages.json';
import { IDGobPeConst } from 'src/app/_shared/constants';

@Component({
  selector: 'app-auth-cancel',
  templateUrl: './auth-cancel.component.html',
  styleUrls: ['./auth-cancel.component.scss']
})
export class AuthCancelComponent implements OnInit {

  private messages: any[];

  _IDGobPeConst: any;
  dnieDeviceCancel: string;
  tokenDeviceCancel: string;

  currentSession: IVerifyTokenModel | null;

  constructor(
   
    private _sgdService: SGDService) {
    this._IDGobPeConst = IDGobPeConst;
    this.getCurrentSession();
    this.getDeviceMessage();
  }

  ngOnInit(): void {}

  getDeviceMessage() {
    this.messages = (messages as any).default;
    this.dnieDeviceCancel = this.messages.find(msg => msg.code === "dnie_device_cancel").message;
    this.tokenDeviceCancel = this.messages.find(msg => msg.code === "token_device_cancel").message;
  }

  private getCurrentSession() {
    this.currentSession = this._sgdService.getCurrentSession();
  }

}
