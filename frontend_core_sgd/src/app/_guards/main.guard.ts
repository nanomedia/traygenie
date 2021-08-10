import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SecurityService } from '../_services/security.service';
import { map, switchMap } from 'rxjs/operators';
import { SGDService } from '../_services/sgd.service';

@Injectable({
  providedIn: 'root'
})
export class MainGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private _securityService: SGDService,
    private _router: Router
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this._check('/');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let redirectUrl = state.url;

    return this._checkRoles(redirectUrl, route);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let redirectUrl = state.url;
    return this._checkRoles(redirectUrl, childRoute);
  }

  private _check(redirectURL): Observable<boolean> {
    return this._securityService.check()
      .pipe(
        switchMap((authenticated) => {
          if (!authenticated) {
            this._router.navigate(['/error']);
            return of(false);
          }
          return of(true);
        })
      );
  }
  private _checkRoles(redirectURL, route?: ActivatedRouteSnapshot): Observable<boolean> {
    return this._securityService.check()
      .pipe(
        switchMap((authenticated) => {
          if (!authenticated) {
            this._router.navigate(['/error']);
            // this._router.navigate(['inicio'], { queryParams: { redirectURL } });
            return of(false);
          }
          else {
            return this._securityService
              .currentSession$
              .pipe(map((auth: any) => {

                if (route?.data?.roles?.includes(auth?.acr)) {
                  return true;
                }

                this._securityService.signOut();
                sessionStorage.clear();
                return false;
              }));
          }
        })
      );
  }


}
