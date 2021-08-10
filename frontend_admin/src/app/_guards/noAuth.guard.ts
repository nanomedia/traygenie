import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SecurityService } from '../_services/security.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(
        private _securityService: SecurityService,
        private _router: Router
    ) {
    }

    private _check(): Observable<boolean> {

        return this._securityService.check()
            .pipe(
                switchMap((authenticated) => {
                    if (authenticated) {

                        return this._securityService.currentUser$
                            .pipe(map((user: any) => {
                                if (user.perfil === 'ADMIN') {
                                    this._router.navigate(['admin-redirect']);
                                    return false;
                                }
                                else if (user.perfil === 'INSTITUTION-USER') {
                                    this._router.navigate(['institution-redirect']);
                                    return false;
                                }

                                return false;

                            }));
                    } else {

                        return of(true);
                    }
                })
            );
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this._check();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this._check();
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check();
    }
}
