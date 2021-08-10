
import { Component, OnInit } from '@angular/core';
import { SGDService } from 'src/app/_services/sgd.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IVerifyTokenIdepRequest } from '../../_interfaces/queryParam.interface';
import { _Schedule } from '@angular/cdk/table';
import { TokenService } from '../../_services/token.service';
import { BusyService } from 'src/app/_services/busy.service';
import { IDGobPeConst } from 'src/app/_shared/constants';
import { environment } from '../../../environments/environment';
import * as errors from '../../_shared/jsons/messages.json';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  queryParams: any | null;
  private isLoading: boolean;
  private isAuthProcessed: boolean;

  isSecondTemplate = false;
  message: string | null;
  private errors: any[] | null;

  constructor(
    private _router: Router,
    private _busyService: BusyService,
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private sgdService: SGDService) {

    this.errors = (errors as any).default;
    this._unsubscribeAll = new Subject();
    this.getQueryParams();
  }
  // http://localhost:4200/#/?scope=profile%20openid&response_type=code&client_id=490d60dc-69c1-42d6-927f-64c4260fa98e&redirect_uri=https:%2F%2Fwww.sbs.gob.pe&popup=&state=hQkFRPxZK2DO9FvoLCZ5Et14QmI7ebdd&acr_values=one_factor&consent=true
  // http://localhost:4200/#/?scope=profile%20openid&response_type=code&client_id=490d60dc-69c1-42d6-927f-64c4260fa98e&redirect_uri=https:%2F%2Fwww.sbs.gob.pe&popup=&state=hQkFRPxZK2DO9FvoLCZ5Et14QmI7ebdd&acr_values=certificate_dnie
  // http://localhost:4200/#/?scope=profile%20openid&response_type=code&client_id=490d60dc-69c1-42d6-927f-64c4260fa98e&redirect_uri=https:%2F%2Fwww.sbs.gob.pe&popup=&state=hQkFRPxZK2DO9FvoLCZ5Et14QmI7ebdd&acr_values=certificate_token
  // http://localhost:4200/#/?scope=profile%20openid&response_type=code&client_id=4asss90d60dc-69c1-42d6-927f-64c4260fa98e&redirect_uri=https:%2F%2Fwww.sbs.gob.pe&popup=&state=hQkFRPxZK2DO9FvoLCZ5Et14QmI7ebdd&acr_values=certificate_dnie

  ngOnInit(): void {
    this.listenLoadingEvent();
    this.getServiceResponse();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  private getQueryParams() {
    const _param = this.activatedRoute.snapshot.queryParams;
    this.queryParams = _param;
    this.activatedRoute.params
      .pipe(map(() => window.history.state))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.queryParams = params;
        this.processTemplate();
      });
  }

  private processTemplate() {
    this.isSecondTemplate = this.queryParams?.cancel ||
      this.queryParams?.post_logout_redirect_uri ||
      this.queryParams.tokenIdp ? true : false;

    if (this.queryParams.cancel && this.queryParams.tokenIdp) {
      this.message = this.errors.find(item => item.code === "redirecting_to_client_cancel")?.message;
    }
    else if (this.queryParams.post_logout_redirect_uri) {
      this.message = this.errors.find(item => item.code === "logout_message")?.message;
    }
    else if (this.queryParams.tokenIdp) {
      this.message = this.errors.find(item => item.code === "redirecting_to_client_success")?.message;
    }
  }

  private manageToken() {
    if (this.tokenService.isExpiredOrNotExist()) {
      this.tokenService.generate();
    }
    const token = this.tokenService.getToken();
    this.queryParams = { ...this.queryParams, rh_code: token.token };
  }

  private async getServiceResponse() {
    const isPopup = this.queryParams.popup === 'true' ?? false;

    if (isPopup) {
      //Proceso con popup lanzando ping
      window.opener.postMessage({ event: IDGobPeConst.EVENT_LOADED }, '*');
      window.addEventListener('message', (event) => {
        switch (event.data.event) {

          case IDGobPeConst.EVENT_CONNECTED:
            this.queryParams = { ...this.queryParams, origin_js: event.origin };
            this.processResponse();
        }
      })

      window.onbeforeunload = () => {
        if (this.isLoading || !this.isAuthProcessed) {
          window.opener.postMessage({ event: IDGobPeConst.EVENT_CANCEL }, '*');
        }
      }
    } else {
      this.processResponse();
    }
  }

  private redirectToConsent(response) {
    const _scopes = response.scopes ?? null;
    const scopes = _scopes?.split(',') ?? null;
    const cancelUri = response.cancelUri ?? null;
    const acronym = response.acronym ?? null;

    this._router.navigate(['/consent'], { state: { scopes, cancelUri, acronym } })

    return false;
  }

  private async processResponse() {
    const tokenIdp = this.queryParams?.tokenIdp ?? null;
    //Proceso Auth
    if (!tokenIdp) {
      this.manageToken();
      const response = await this.sgdService.getAuth(this.queryParams).toPromise();
      
      if (response.success) {
        this.isAuthProcessed = true;

        if (response.directConsent) {
          this.redirectToConsent(response);
          return false;
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
    //Proceso TokenIDP
    else if (tokenIdp) {
      const token = this.tokenService.getToken();

      if (window.opener && window.opener !== window) {
        window.onbeforeunload = () => {
          window.opener.postMessage({ event: IDGobPeConst.EVENT_CANCEL }, '*');
        }
      }

      if (token) {
        this.queryParams.rh_code = token.token;
        const param = this.queryParams as IVerifyTokenIdepRequest;
        const response = await this.sgdService.getVerifyTokenIdp(param).toPromise();

        if (response.success) {


          if (response.consent) {
            this.redirectToConsent(response);
            return false;
          }

          //Proceso sin popup
          if (response.redirectUri) {
            location.href = response.redirectUri;
          }
          //Proceso con popup
          else if (response.data) {
            if (window.opener && window.opener !== window) {
              window.onbeforeunload = () => {
                window.opener.postMessage({ event: IDGobPeConst.EVENT_AUTH_COMPLETE, data: response.data }, '*');
              }
              window.close();
            }
          } else {
            location.href = environment.BASE_URL_DEFAULT_REDIRECT;
          }
        }
      }
    }
  }

}
