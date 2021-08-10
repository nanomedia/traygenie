import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IResponse } from '../_interfaces/response.interface';
import { IProfileResponse } from '../_interfaces/profile.interface';
import { IDeviceResponse } from '../_interfaces/device.interface';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {

  constructor(private _httpClient: HttpClient) { }

  getProfile() {
    const url = `${environment.BASE_URL_SERVICE_CITIZEN}/profile`;
    return this._httpClient.get<IResponse<IProfileResponse>>(url);
  }

  getDevices(count?: number) {
    const param = count ? `?count=${count}` : '?count';
    const url = `${environment.BASE_URL_SERVICE_CITIZEN}/devices${param}`;
    return this._httpClient.get<IResponse<IDeviceResponse>>(url);
  }
}
