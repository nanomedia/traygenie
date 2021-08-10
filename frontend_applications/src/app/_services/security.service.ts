import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { UsuarioResponse } from '../_interfaces/usuario.interface';
import { UsuarioModel } from '../_models/usuario.model';
import { IResponse } from '../_interfaces/response.interface';
import { Router } from '@angular/router';
import { MessageService } from '../_shared/services/message.service';


@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private _authenticated: boolean;

  private currentUserSource = new ReplaySubject<UsuarioModel>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private _router: Router,
    private _messageService: MessageService,
    private _httpClient: HttpClient) {

    this._authenticated = false;
  }

  set accessToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  get accessToken(): string {
    return localStorage.getItem('access_token');
  }

  signIn(token: string) {

    if (this._authenticated) {
      return throwError('User is already logged in.');
    }

    if (token) {
      this.accessToken = token;
      this.loadCurrentUser();
      this._authenticated = true;
    } else {
      return throwError('Token does not exist.');
    }
  }

  async signOut(): Promise<Observable<any>> {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/logout`;
    const response = await this._httpClient.get<IResponse<any>>(url).toPromise();
    if (response.success) {
      localStorage.removeItem('access_token');
      this._authenticated = false;
      location.href = response.redirectUri;
    }
    return of(true);
  }

  signOutNoService() {
    localStorage.removeItem('access_token');
    this._authenticated = false;
    this._router.navigate(['inicio']);
  }

  loadCurrentUser() {
    if (this.accessToken !== null) {

      const helper = new JwtHelperService();
      const decodedToken: UsuarioResponse = helper.decodeToken(this.accessToken);
      const { doc, doc_type, first_name, extra } = decodedToken;
      let user: UsuarioModel = { doc, doc_type, first_name, extra };

      if (decodedToken?.extra) {
        const extra = decodedToken.extra;
        if (extra?.developer.length > 0) {
          user.perfil = 'APP-USER';       
        }
      }

      if (!user.perfil) {
        localStorage.removeItem('access_token');
        this._messageService.showUserUnathorized();
        this.signOutNoService()
      }

      this.currentUserSource.next(user as UsuarioModel);
    }
  }

  check(): Observable<boolean> {

    if (this._authenticated) {
      return of(true);
    }

    if (!this.accessToken) {
      return of(false);
    }
    const helper = new JwtHelperService();
    if (helper.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    return of(true);

  }
}
