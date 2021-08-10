import { Component, OnInit } from '@angular/core';
import * as messages from '../../_shared/jsons/messages.json';
import { IDGobPeConst } from 'src/app/_shared/constants';
import { IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { SGDService } from 'src/app/_services/sgd.service';


@Component({
  selector: 'app-auth-complete',
  templateUrl: './auth-complete.component.html',
  styleUrls: ['./auth-complete.component.scss']
})
export class AuthCompleteComponent implements OnInit {

  _IDGobPeConst: any;
  dnieDeviceComplete: string;
  tokenDeviceComplete: string;
  currentSession: IVerifyTokenModel | null;
  
  private messages: any[];

  constructor(private _sgdService: SGDService) {
    this._IDGobPeConst = IDGobPeConst;
    this.getDeviceMessage();
    this.getCurrentSession();
  }

  ngOnInit(): void { }

  getDeviceMessage() {
    this.messages = (messages as any).default;
    this.dnieDeviceComplete = this.messages.find(msg => msg.code === "dnie_device_complete").message;
    this.tokenDeviceComplete = this.messages.find(msg => msg.code === "token_device_complete").message;
  }

  private getCurrentSession() {
    this.currentSession = this._sgdService.getCurrentSession();
  }

}
