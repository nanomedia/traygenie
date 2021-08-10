import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class IotClientService {

  validatedCode$ = new BehaviorSubject<any>(null);
  validatedCodeError$ = new BehaviorSubject<any>(null);
  processComplete$ = new BehaviorSubject<any>(null);
  processCancel$ = new BehaviorSubject<any>(null);
  invalidCertificate$ = new BehaviorSubject<any>(null);
  
  constructor(private socket: Socket) {
    
  }

  setCode(token: string) {
    this.socket.emit('setCode', { token });
  }

  init() {
    this.validateCode();
    this.validatedCodeError();
    this.processComplete();
    this.processCancel();
    this.invalidCertificate();
  }

  private validateCode() {
    this.socket.on('validatedCode', (response => {
      this.validatedCode$.next(response);
    }));
  }

  private validatedCodeError() {
    this.socket.on('validatedCodeError', (response => {
      this.validatedCodeError$.next(response);
    }));
  }

  private processComplete() {
    this.socket.on('processComplete', (response => {
      this.processComplete$.next(response);
    }));
  }

  private processCancel() {
    this.socket.on('processCancel', (response => {
      this.processCancel$.next(response);
    }));
  }

  private invalidCertificate() {
    this.socket.on('invalidCertificate', (response => {
      this.invalidCertificate$.next(response);
    }));
  }


}
