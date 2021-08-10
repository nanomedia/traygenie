import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IVerifyTokenIdepRequest } from '../_interfaces/queryParam.interface';
import { IVerifyTokenIdpResponse } from '../_interfaces/VerifyToken.interface';

@Injectable({
  providedIn: 'root'
})
export class SGDService {

  constructor(private httpClient: HttpClient) { }

  getAuth(params: any) {
    const url = `${environment.BASE_URL_SERVICE_CORE}/auth`;
    return this.httpClient.post<any>(url, params);
  }

  /**
   * 
   * @param params parametro para verificar token
   * @returns servicio observable
   */
  getVerifyTokenIdp(params: IVerifyTokenIdepRequest) {
    const url = `${environment.BASE_URL_SERVICE_CORE}/verify-token-idp`;
    return this.httpClient.post<IVerifyTokenIdpResponse>(url, params);
  }

  /**
   * Consume el API /consent
   * @param rh_code codigo token
   * @returns respuesta observable
   */
  postConsent(rh_code: string) {
    const url = `${environment.BASE_URL_SERVICE_CORE}/consent`;
    return this.httpClient.post<any>(url, { rh_code });
  }
}
