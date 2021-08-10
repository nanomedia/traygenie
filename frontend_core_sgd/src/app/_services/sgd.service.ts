import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IVerifyDocRequest, IVerifyTokenResponse, IVerifyPasswordRequest, IVerifyTokenModel } from '../_interfaces/verify-token.interface';
import { IResponse } from '../_interfaces/response.interface';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IClientResponse } from '../_interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class SGDService {

  private currentSessionSource = new BehaviorSubject<IVerifyTokenModel>(null);
  currentSession$ = this.currentSessionSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  get accessToken() {
    return sessionStorage.getItem('accessToken');
  }
  set accessToken(token: string) {
    sessionStorage.setItem('accessToken', token);
  }

  get cancelUri() {
    return sessionStorage.getItem('cancelUri');
  }

  set cancelUri(cancelUri: string) {
    sessionStorage.setItem('cancelUri', cancelUri);
  }

  get changeAcrUri() {
    return sessionStorage.getItem('changeAcrUri');
  }

  set changeAcrUri(changeAcrUri: string) {
    sessionStorage.setItem('changeAcrUri', changeAcrUri);
  }

  

  getChangeToLegacy() {
    const url = `${environment.BASE_URL_SERVICE_CORE_SGD}/change-to-legacy`;
    return this.httpClient.get<any>(url);
  }


  getClient() {
    const url = `${environment.BASE_URL_SERVICE_CORE_SGD}/get-client`;
    return this.httpClient.get<IClientResponse>(url);
  }

  postCompleteClient(code: string) {
    const url = `${environment.BASE_URL_SERVICE_CORE_SGD}/complete-client`;
    return this.httpClient.post<any>(url, { code });
  }

  getVerifyTokenIdp(token: string) {

    const url = `${environment.BASE_URL_SERVICE_CORE_SGD}/verify-token?token=${token}`;
    return this.httpClient.get<IVerifyTokenResponse>(url).pipe(
      switchMap((response: IVerifyTokenResponse) => {

        if (response.success) {

          this.accessToken = response.token;
          this.cancelUri = response.cancelUri;

          if (response.changeAcrUri) {
            this.changeAcrUri = response.changeAcrUri;
          }

          const helper = new JwtHelperService();
          const { reqId, acr } = helper.decodeToken(this.accessToken);
          const model: IVerifyTokenModel = { reqId, acr };
          this.currentSessionSource.next(model);
        }
        else {
          throw Error('Error')
        }

        return of(response);
      })
    );
  }

  verifyCurrentSession() {
    return this.currentSessionSource.getValue() ? true : false;
  }

  getCurrentSession() {
    return this.currentSessionSource.getValue();
  }

  loadCurrentData() {

    if (this.accessToken) {
      const helper = new JwtHelperService();
      const { reqId, acr } = helper.decodeToken(this.accessToken);
      const model: IVerifyTokenModel = { reqId, acr };
      this.currentSessionSource.next(model);
    } else {
      this.signOut();
      sessionStorage.clear();
    }
  }


  check(): Observable<boolean> {
    const response = this.currentSessionSource.getValue() ? true : false;
    return of(response);
  }


  signOut() {
    sessionStorage.clear();
    this.currentSessionSource.next(null);
  }

  postVerifyDoc(request: IVerifyDocRequest) {
    const url = `${environment.BASE_URL_SERVICE_CORE_SGD}/verify-doc`;
    return this.httpClient.post<IResponse>(url, request);
  }

  postVerifyPassword(request: IVerifyPasswordRequest) {
    const url = `${environment.BASE_URL_SERVICE_CORE_SGD}/verify-password`;
    return this.httpClient.post<IResponse>(url, request);
  }
}
