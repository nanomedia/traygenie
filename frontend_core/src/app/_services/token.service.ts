import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  constructor() { }

  private makeRandom() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const lengthOfCode = 20;
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  generate() {
    const expired = environment.TTL_CODE * 1000;
    const expireAt = Date.now() + expired;
    localStorage.setItem('token', this.makeRandom());
    localStorage.setItem('expireAt', expireAt.toString());
  }

  getToken() {
    const token = localStorage.getItem('token');
    const expireAt = +localStorage.getItem('expireAt');
    const _token: IToken = { token, expireAt };
    return _token;
  }

  isExpiredOrNotExist() {
    const token = localStorage.getItem('token') ?? null;
    const expireAt = localStorage.getItem('expireAt') ?? null;   
    return !token || !expireAt || (Date.now() > +expireAt);
  }
}

export interface IToken {
  token: string;
  expireAt: number;
}
