import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SGDService } from '../_services/sgd.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _router: Router, private _sgdService: SGDService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Clone the request object
    let newReq = request.clone();

    const helper = new JwtHelperService();

    if (this._sgdService.accessToken && !helper.isTokenExpired(this._sgdService.accessToken)) {
      newReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + this._sgdService.accessToken)
      });
    }


    return next.handle(newReq).pipe(
      catchError(e => {
       
        switch (e.status) {
          case 401: {
            this._router.navigate(['/error', 'unauthorized_error']);
            break;
          }
          case 403: {
            this._router.navigate(['/error', 'forbidden_error']);
            break;
          }
          case 400: {
            const errorEvent = e as ErrorEvent;
            this.redirect(errorEvent);
            break;
          }
          case 404: {
            this._router.navigate(['/error', 'internal_error']);
            break;
          }
          case 500: {
            this._router.navigate(['/error', 'internal_error']);
            break;
          }
        }
        return throwError('');
      })
    );
  }

  private redirect(errorEvent: ErrorEvent) {
    const error = errorEvent?.error;
    this._sgdService.signOut();
    sessionStorage.clear();
    if (error.code) {
      this._router.navigate(['/error', error.code]);
    }
    else {
      this._router.navigate(['/error', 'invalid_request']);
    }
  }
}
