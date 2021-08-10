import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IServiceEnabledRequest, IServiceOneResponse, IServiceUpdateAuthRequest, IServiceUpdateRequest } from '../_interfaces/service.interface';
import { IResponse } from '../_interfaces/response.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private _router: Router,
    private httpClient: HttpClient) { }

  postApplicationServiceEnabled(request: IServiceEnabledRequest) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/service/enabled`;
    return this.httpClient.post<IResponse<any>>(url, request);
  }

  putApplicationServiceUpdate(request: IServiceUpdateRequest) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/service-update`;
    return this.httpClient.put<IResponse<any>>(url, request);
  }

  // putApplicationServiceUpdateAuth(request: IServiceUpdateAuthRequest) {
  //   const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/service-update-authorization`;
  //   return this.httpClient.put<IResponse<any>>(url, request);
  // }

  putApplicationServiceDisabled(id: string) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/service/disabled`;
    return this.httpClient.put<IResponse<any>>(url, { id });
  }

  postApplicationServiceRegenerate(id: string) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/service/regenerate`;
    return this.httpClient.post<IResponse<any>>(url, { id });
  }

  postApplicationServiceDownload(id: string) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/service/download`;
    return this.httpClient.post<IResponse<any>>(url, { id });
  }

  getApplicationServiceOne(client_id: string, service_code: string) {

    const clientId = `client_id=${encodeURI(client_id.trim())}`;
    const serviceCode = `service_code=${encodeURI(service_code.trim())}`;
    const _arrayParam = [clientId, serviceCode];
    const params = _arrayParam.join('&');

    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/service/one?${params}`;
    return this.httpClient.get<IResponse<IServiceOneResponse>>(url);
  }


}
