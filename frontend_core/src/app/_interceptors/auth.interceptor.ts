import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '../_services/token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let newReq = request.clone();

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
        return throwError(e);
      })
    );
  }

  private redirect(errorEvent: ErrorEvent) {
    const error = errorEvent?.error;
    sessionStorage.clear();
    if (error?.code) {
      this._router.navigate(['/error', error.code]);
    }
    else {
      this._router.navigate(['/error', 'invalid_request']);
    }
  }
}
