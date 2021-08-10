
import { Component, NgZone, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/_services/security.service';
import { environment } from 'src/environments/environment';
import { BusyService } from '../../../../_services/busy.service';

declare const IDGobPe: any;
declare const IDGobPeConst: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  private ACR_METHOD: string;

  constructor(
    private _zone: NgZone,
    private _busyService: BusyService,
    private _securityService: SecurityService) {
  }

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
        this._busyService.hidde();
      })

    });
    IDGobPe.onSuccess((response) => {
      this.processAuth(response.idToken);
    });
  }

  initWithAcrCertificateDnie() {
    this.ACR_METHOD = IDGobPeConst.ACR_CERTIFICATE_DNIE
    // this.ACR_METHOD = IDGobPeConst.ACR_ONE_FACTOR
    this.idGobPeInit();
    this.startAuth();
  }

  initWithAcrCertificateToken() {
    this.ACR_METHOD = IDGobPeConst.ACR_CERTIFICATE_TOKEN
    this.idGobPeInit();
    this.startAuth();
  }

  private processAuth(token: string) {
    if (token) {
      this._securityService.signIn(token);
      location.reload();
    }
  }

  private startAuth() {
    this._busyService.show();
    IDGobPe.auth();
  }


}
