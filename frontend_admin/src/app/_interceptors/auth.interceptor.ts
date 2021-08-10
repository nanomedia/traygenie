import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SecurityService } from '../_services/security.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MessageService } from '../_shared/services/message.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private _messageService: MessageService,
    private _securityService: SecurityService,
    private _router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    // Clone the request object
    let newReq = request.clone();

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    const helper = new JwtHelperService();
    if (this._securityService.accessToken && !helper.isTokenExpired(this._securityService.accessToken)) {
      newReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + this._securityService.accessToken)
      });
    }

    return next.handle(newReq).pipe(
      catchError(e => {
        switch (e.status) {
          case 401: {
            this._messageService.showSessionExpired();
            this.errorRedirect();
            break;
          }
          case 403: {
            this._messageService.showUserUnathorized();
            this.errorRedirect();
            break;
          }
          case 400: {
            this.errorRedirect();
            break;
          }
          case 404: {
            this.errorRedirect();
            break;
          }
          case 500: {
            this._messageService.showWarning("Ha ocurrido un error, por favor vuelve a intentarlo más tarde.");
            this.errorRedirect();
            break;
          }
          default: {
            const production = environment.production ?? false;
            if (!production) {
              this._messageService.showError(e.message);
            } else {
              this._messageService.showWarning("Ha ocurrido un error, por favor vuelve a intentarlo más tarde.");
              this.errorRedirect();
            }

            break;
          }
        }
        return throwError(e);
      })
    );
  }

  private errorRedirect() {
    this._securityService.signOutNoService();
  }
}
