import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SGDService } from '../../_services/sgd.service';
import { TokenService } from '../../_services/token.service';
import { IDGobPeConst } from 'src/app/_shared/constants';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss']
})


export class DatosComponent implements OnInit {

  private scopes: any[];
  private cancelUri: string | null;
  private _unsubscribeAll: Subject<any>;
  isPressed = false;

  acronym: string | null;
  scopeData: any[] | null;

  consentData = [
    { type: 'profile', description: 'DNI' },
    { type: 'profile', description: 'Primer nombre' },
    { type: 'email', description: 'Correo electrónico' },
    { type: 'phone', description: 'Número de celular' },
    { type: 'offline_access', description: 'Acceso sin conexión.' },
  ];

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private _tokenService: TokenService,
    private _sgdService: SGDService) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getQueryParams();
    if (window.opener && window.opener !== window) {
      window.onbeforeunload = () => {
        window.opener.postMessage({ event: IDGobPeConst.EVENT_CANCEL }, '*');
      }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private getQueryParams() {
    this.activatedRoute.params
      .pipe(map(() => window.history.state))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.scopes = params.scopes ?? null;
        this.cancelUri = params.cancelUri ?? null;
        this.acronym = params.acronym ?? null;

        if (!(this.scopes && this.cancelUri && this.acronym)) {
          this._router.navigate(['/error', 'internal_error']);
        }
        this.getScopeData();
      });
  }

  private getScopeData() {
    this.scopeData = this.consentData
      .filter(item => this.scopes.some(scope => scope === item.type)) ?? null;
  }


  cancel() {
    if (this.cancelUri) {
      location.href = this.cancelUri;
    }
  }

  async confirm() {
    this.isPressed = true;
    const token = this._tokenService.getToken();
    const response = await this._sgdService.postConsent(token.token).toPromise();
    if (response.success) {
      if (window.opener && window.opener !== window) {
        window.onbeforeunload = () => { }
      }
      if (response.redirectUri) {
        location.href = response.redirectUri;
      }
      else if (response.data) {
        if (window.opener && window.opener !== window) {

          window.onbeforeunload = () => {
            window.opener.postMessage({ event: IDGobPeConst.EVENT_AUTH_COMPLETE, data: response.data }, '*');
          }
          window.close();
        }
      }
    }
  }

}
