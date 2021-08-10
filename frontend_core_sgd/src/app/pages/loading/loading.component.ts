import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { SGDService } from 'src/app/_services/sgd.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private token: string | null;

  constructor(
    private _router: Router,
    private _sgdService: SGDService,
    private _activatedRoute: ActivatedRoute) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getQueryParam();
  }

  private getQueryParam() {
    this._activatedRoute.params
      .pipe(map(() => window.history.state))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.token = params['token'] ?? null;
        if (this.token) {
          this.getServiceResponse(this.token);
        } else if (this._sgdService.verifyCurrentSession()) {
          const session = this._sgdService.getCurrentSession();
          this.pageRedirect(session.acr);
        } else {
          const code = "invalid_request";
          this._router.navigate(['/error', code]);
        }
      });
  }

  private async getServiceResponse(token: string) {
    const response = await this._sgdService.getVerifyTokenIdp(token).toPromise();
    if (response.success) {
      const model: IVerifyTokenModel = this._sgdService.getCurrentSession()
      this.pageRedirect(model.acr);
    } else {
      this._sgdService.signOut();
      sessionStorage.clear();
    }
  }
  
  private pageRedirect(acr: string) {
   
    switch (acr) {
      case 'one_factor':
        this._router.navigate(['/dni'], { replaceUrl: true });
        break

      case 'certificate_dnie':
        this._router.navigate(['/dispositivo'], { replaceUrl: true });
        break

      case 'certificate_token':
        this._router.navigate(['/dispositivo'], { replaceUrl: true });
        break

      case 'certificate_dnie_legacy':
        this._router.navigate(['/dispositivo'], { replaceUrl: true });
        break

      case 'certificate_token_legacy':
        this._router.navigate(['/dispositivo'], { replaceUrl: true });
        break

      default:
        this._router.navigate(['/error']);
        break

    }
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
