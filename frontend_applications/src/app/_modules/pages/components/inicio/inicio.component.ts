
import { Component, NgZone, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/_services/security.service';
import { environment } from 'src/environments/environment';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingSpinnerComponent } from 'src/app/_shared/components/loading-spinner/loading-spinner.component';
import { BusyService } from '../../../../_services/busy.service';
import { Router } from '@angular/router';

declare const IDGobPe: any;
declare const IDGobPeConst: any;
declare let idgobpeUris: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  private ACR_METHOD: string;
  private overlayRef: OverlayRef;
  constructor(
    private _router: Router,
    private _zone: NgZone,
    private overlay: Overlay,
    private _busyService: BusyService,
    private _securityService: SecurityService) { }

  ngOnInit(): void {
    this.idGobPeInit();

    //Solo desarrollo
    //http://localhost:61593
    // idgobpeUris = {
    //   auth: 'http://localhost:4200/',
    //   logout: 'http://localhost:4200/',
    //   service: 'http://localhost:4200/',
    //   token: 'https://yemml50107.execute-api.us-east-2.amazonaws.com/qa/token',
    //   userInfo: 'https://yemml50107.execute-api.us-east-2.amazonaws.com/qa/token',
    // };
    // console.log(idgobpeUris);
  }

  idGobPeInit() {
    const param = {
      clientId: environment.IDGOBPE_CLIENT_ID,
      acr: this.ACR_METHOD,
      responseTypes: [IDGobPeConst.RESPONSE_TYPE_ID_TOKEN],
      scopes: [IDGobPeConst.SCOPE_PROFILE]
    };

    IDGobPe.init(param);
    IDGobPe.onCancel(() => {
      this._zone.run(() => {
        this._busyService.hide();
      });
    })
    IDGobPe.onSuccess((response) => {
      this.processAuth(response.idToken);
    });
  }

  initWithAcrCertificateDnie() {
    // this.ACR_METHOD = IDGobPeConst.ACR_CERTIFICATE_DNIE
    this.ACR_METHOD = IDGobPeConst.ACR_ONE_FACTOR
    this.idGobPeInit();
    this.startAuth();
  }

  initWithAcrCertificateToken() {
    this.ACR_METHOD = IDGobPeConst.ACR_CERTIFICATE_TOKEN
    this.idGobPeInit();
    this.startAuth();
  }

  private processAuth(token: string) {
    this._zone.run(() => {
      if (token) {
        this._busyService.hide();
        this._securityService.signIn(token);
        this._router.navigate(['login-redirect']);
      }
    })
  }

  private startAuth() {
    this._busyService.show();
    IDGobPe.auth();
  }

}
