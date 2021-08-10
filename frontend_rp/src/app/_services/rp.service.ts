import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IRpAuthRequest } from '../_interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class RPService {

  constructor(private _httpClient: HttpClient) { }

  auth(request: IRpAuthRequest) {
    const url = `${environment.BASE_URL_SERVICE_RP}/auth`;
    return this._httpClient.post<any>(url, request);
  }

  endpoint(request: any) {
    const url = `${environment.BASE_URL_SERVICE_RP}/endpoint`;
    return this._httpClient.post<any>(url, request);
  }
}
