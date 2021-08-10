import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { _IDGobPeConst } from 'src/app/_shared/constants';
import { IRpAuthRequest } from '../../_interfaces/auth.interface';
import { RPService } from '../../_services/rp.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from '../../_services/busy.service';
import * as messages from '../../_shared/jsons/messages.json';
import { DomSanitizer } from '@angular/platform-browser';

declare const IDGobPe: any;
declare const IDGobPeConst: any;
declare let idgobpeUris: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  opened = false;
  nav_position: string = 'end';
  formGroup: FormGroup | null;
  acrData: string[];
  currentMessageItem: any | null;
  responseData$ = new BehaviorSubject<any>(null);

  private messages: any[];
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _sanitizer: DomSanitizer,
    private _busyService: BusyService,
    private _zone: NgZone,
    private _router: Router,
    private _rpService: RPService,
    private fb: FormBuilder) {

    this.messages = (messages as any).default;
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.createForm();
    this.acrData = [
      // IDGobPeConst.ACR_ONE_FACTOR,
      IDGobPeConst.ACR_CERTIFICATE_DNIE,
      IDGobPeConst.ACR_CERTIFICATE_TOKEN,
      IDGobPeConst.ACR_CERTIFICATE_DNIE_LEGACY,
      IDGobPeConst.ACR_CERTIFICATE_TOKEN_LEGACY
    ];

    this.responseData$.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      if (data) {
        this._zone.run(() => {
          this._router.navigate(['viewer'], { state: { token: data } });
        })
      }
    });
  }

  getMessageItem(code: string) {
    this.opened = !this.opened;
    this.currentMessageItem = this.messages.find(item => item.code === code);
  }

  getArrayForm(name: string) {
    return (this.formGroup.controls[name] as FormArray).controls;
  }

  getControlName(group: FormGroup) {
    return group.controls['name'].value
  }
  
  trustHTML(value) {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
  private createForm() {

    const scopes = this.fb.array(
      [
        this.fb.group({ name: [IDGobPeConst.SCOPE_PROFILE], value: [false] }),
        this.fb.group({ name: [IDGobPeConst.SCOPE_EMAIL], value: [false] }),
        this.fb.group({ name: [IDGobPeConst.SCOPE_PHONE], value: [false] }),
        this.fb.group({ name: [IDGobPeConst.SCOPE_OFFLINE_ACCESS], value: [false] })
      ]
    );
    const prompt = this.fb.array(
      [
        this.fb.group({ name: [IDGobPeConst.PROMPT_NONE], value: [false] }),
        this.fb.group({ name: [IDGobPeConst.PROMPT_LOGIN], value: [false] }),
        this.fb.group({ name: [IDGobPeConst.PROMPT_CONSENT], value: [false] })
      ]
    );
    const responseTypes = this.fb.array(
      [
        this.fb.group({ name: [IDGobPeConst.RESPONSE_TYPE_CODE], value: [true] }),
        this.fb.group({ name: [IDGobPeConst.RESPONSE_TYPE_ID_TOKEN], value: [false] }),
        this.fb.group({ name: [IDGobPeConst.RESPONSE_TYPE_TOKEN], value: [false] })
      ]
    );

    const responseTypesValue = responseTypes.value;
    let hiddenControl = new FormControl(this.mapItems(responseTypesValue), Validators.required);

    responseTypes.valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((v) => {
        hiddenControl.setValue(this.mapItems(v));
      });

    this.formGroup = this.fb.group(
      {
        scopes,
        prompt,
        responseTypes,
        hiddenControl,
        acr: [IDGobPeConst.ACR_CERTIFICATE_DNIE],
        maxAge: [null],
        loginHint: [null]
      }
    );
  }

  mapItems(items) {
    let selectedItems = items.filter((item) => item.value).map((item) => item.name);
    return selectedItems.length ? selectedItems : null;
  }

  continue() {
    if (!this.isPopup()) { this.authByServiceInit(); }
    else { this.authByPopupInit(); }
  }

  private async authByServiceInit() {
    const request = (this.prepareRequestData() as IRpAuthRequest);
    const response = await this._rpService.auth(request).toPromise();

    if (response.success) {
      this._busyService.show();
      const uri = response.redirectUri;
      location.href = uri;
    }
  }

  private isPopup() {
    const responseTypes: string[] = this.getArrayForm('responseTypes')
      .filter((group: FormGroup) => group.controls['value'].value === true)
      .map((group: FormGroup) => group.controls['name'].value);

    return responseTypes.some(item =>
      [IDGobPeConst.RESPONSE_TYPE_ID_TOKEN,
      IDGobPeConst.RESPONSE_TYPE_TOKEN].some(item2 => item2 == item));
  }

  private authByPopupInit() {
    this._busyService.show();
    const param = this.preparePopupData();
    IDGobPe.init(param);
    IDGobPe.onCancel(() => { this._busyService.hide(); });
    IDGobPe.onSuccess((response) => {
      if (response) {
        this.responseData$.next(response);
      }
    });

    IDGobPe.auth();
  }

  private preparePopupData() {

    const acr = this.getControlValue('acr');
    const maxAge = this.getControlValue('maxAge');
    const loginHint = this.getControlValue('loginHint');

    const prompts: string[] = this.getArrayForm('prompt')
      .filter((group: FormGroup) => group.controls['value'].value === true)
      .map((group: FormGroup) => group.controls['name'].value);

    const scopes: string[] = this.getArrayForm('scopes')
      .filter((group: FormGroup) => group.controls['value'].value === true)
      .map((group: FormGroup) => group.controls['name'].value);

    const responseTypes: string[] = this.getArrayForm('responseTypes')
      .filter((group: FormGroup) => group.controls['value'].value === true)
      .map((group: FormGroup) => group.controls['name'].value);

    return {
      clientId: environment.IDGOBPE_CLIENT_ID,
      scopes: scopes,
      acr: acr,
      prompts: prompts,
      responseTypes: responseTypes,
      maxAge: maxAge,
      loginHint: loginHint
    };
  }

  private prepareRequestData() {

    const acr = this.getControlValue('acr');
    const maxAge = this.getControlValue('maxAge');
    const loginHint = this.getControlValue('loginHint');

    const prompt: string = this.getArrayForm('prompt')
      .filter((group: FormGroup) => group.controls['value'].value === true)
      .map((group: FormGroup) => group.controls['name'].value)
      .join(' ');

    const scopes: string = this.getArrayForm('scopes')
      .filter((group: FormGroup) => group.controls['value'].value === true)
      .map((group: FormGroup) => group.controls['name'].value)
      .join(' ');

    const responseTypes: string = this.getArrayForm('responseTypes')
      .filter((group: FormGroup) => group.controls['value'].value === true)
      .map((group: FormGroup) => group.controls['name'].value)
      .join(' ');

    return { scopes, acr, maxAge, loginHint, prompt, responseTypes };
  }

  private getControlValue(name: string) {
    return this.formGroup.controls[name].value;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
