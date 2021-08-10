
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from 'src/app/_services/busy.service';
import { SecurityService } from 'src/app/_services/security.service';
import { environment } from 'src/environments/environment';

declare const IDGobPe: any;
declare const IDGobPeConst: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  title = '';
  url = '';

  private ACR_METHOD: string;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _router: Router,
    private _zone: NgZone,
    private _busyService: BusyService,
    private _securityService: SecurityService) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.createTitle();

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

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createTitle() {

    if (environment.COMPILER_MODE === 'admin') {
      this.title = 'PORTAL ADMINISTRADOR'
      this.url = 'admin-redirect';
    } else {
      this.title = 'PORTAL INSTITUCIONES'
      this.url = 'institution-redirect';
    }
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
    // this.ACR_METHOD = IDGobPeConst.ACR_ONE_FACTOR;
    this.idGobPeInit();
    this.startAuth();
  }

  initWithAcrCertificateToken() {
    this.ACR_METHOD = IDGobPeConst.ACR_CERTIFICATE_TOKEN;
    this.idGobPeInit();
    this.startAuth();
  }

  private processAuth(token: string) {   
    this._zone.run(() => {
      this._busyService.hidde();
      if (token) {
        this._securityService.signIn(token);
        this._securityService.currentUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe(user => {          
          
          if (user.perfil === 'ADMIN') {
            this._router.navigate(['admin-redirect']);
          }
          else {
            this._router.navigate(['institution-redirect']);
          }
        });
      }
    })
  }

  private startAuth() {
    this._busyService.show();
    IDGobPe.auth();
  }

}
