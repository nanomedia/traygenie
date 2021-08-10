import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Subject } from 'rxjs';
import { BusyService } from 'src/app/_services/busy.service';
import { ApplicationService } from 'src/app/_services/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ServiceService } from '../../../../_services/service.service';
import { IAppOneResponse } from '../../../../_interfaces/application.interface';
import { IServiceOneResponse, IServiceUpdateRequest } from '../../../../_interfaces/service.interface';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { RegexPatterns } from '../../../../_shared/regexPatterns';
import { MessageService } from 'src/app/_shared/services/message.service';

@Component({
  selector: 'app-autentificacion-digital',
  templateUrl: './autentificacion-digital.component.html',
  styleUrls: ['./autentificacion-digital.component.scss']
})
export class AutentificacionDigitalComponent extends BaseComponent implements OnInit {

  isLoading = false;
  enabled = false;
  showPage = false;

  currentApp: IAppOneResponse | null;
  currentService: IServiceOneResponse | null;

  configForm: FormGroup | null;

  serviceName = 'auth';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _formBuilder: FormBuilder,
    private _busyService: BusyService,
    private _messageService: MessageService,
    private _srvService: ServiceService,
    public appService: ApplicationService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {

    super(appService, activatedRoute, router);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.listenLoadingEvent();
    this.getApplicationData();
    this.createForms();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  addUri(item: FormGroup, arrayName: string) {
    const isTouched = item.controls['isTouched'].value;

    if (!isTouched && this.getformArray(arrayName).length < 20) {
      const array = this.configForm.controls[arrayName] as FormArray;
      array.push(this.newUriFormGroup(null, false));
    }

    item.controls['isTouched'].setValue(true);
  }


  getformArray(arrayName: string) {
    return (this.configForm.controls[arrayName] as FormArray).controls;
  }

  isUrlError(controlName: string) {
    return this.configForm.controls[controlName].invalid;
  }

  isUrlErrorByCtrl(control: FormControl) {
    return control.invalid;
  }


  async save() {
    const formValue = this.configForm.value;
    const id = this.currentService._id;
    const service_code = this.currentService.service_code;
    const tos_url = formValue.tos_url.trim();
    const policy_url = formValue.policy_url.trim();
    const redirect_uris = (formValue._redirect_uris as [])
      .filter((x: { uri }) => x.uri !== null)
      .map((x: { uri }) => x.uri.trim()).join(',');

    const js_origin_uris = (formValue._js_origin_uris as [])
      .filter((x: { uri }) => x.uri !== null)
      .map((x: { uri }) => x.uri.trim()).join(',');

    const request: IServiceUpdateRequest = { id, service_code, tos_url, policy_url, redirect_uris, js_origin_uris };

    const response = await this._srvService.putApplicationServiceUpdate(request).toPromise();

    if (response?.success) {
      this._messageService.showSuccessRegister();
      this.configForm.markAsPristine();

    } 
   
    
    else if (response?.error) {
      const error = response?.error;
      this._messageService.showWarning(error.message);
    }
  }

  createForms() {

    this.configForm = this._formBuilder.group({
      tos_url: [null, [Validators.required, Validators.pattern(RegexPatterns.URL)]],
      policy_url: [null, [Validators.required, Validators.pattern(RegexPatterns.URL)]],
      _redirect_uris: this._formBuilder.array(
        [
          this._formBuilder.group(
            {
              uri: [null, [Validators.pattern(RegexPatterns.URL)]],
              isTouched: [false]
            })

        ]),
      _js_origin_uris: this._formBuilder.array(
        [
          this._formBuilder.group(
            {
              uri: [null, Validators.pattern(RegexPatterns.URL)],
              isTouched: [false]
            })
        ]),
    });


  }

  disableEvent(disabled: boolean) {
    this.enabled = !disabled;
  }

  enableEvent(enabled: boolean) {
    this.enabled = enabled;
    this.getApplicationData();
  }

  newCredentialEvent(success: boolean) {
    if (success) {
      this.getApplicationData();
    }
  }


  private async getApplicationData() {
    this.appService.getCurrentApp()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(app => {
        if (app) {
          this.currentApp = app;
          this.getServiceOne();
        }
      })
  }

  get jsOriginUrisFormArray(): FormArray {
    return this.configForm.get('_js_origin_uris') as FormArray;
  }
  get redirectUrisFormArray(): FormArray {
    return this.configForm.get('_redirect_uris') as FormArray;
  }

  private newUriFormGroup(uri: string, isTouched: boolean) {
    return this._formBuilder.group(
      {
        uri: [uri, [Validators.pattern(RegexPatterns.URL)]],
        isTouched: [isTouched]
      });
  }


  private setFormConfigData() {

    if (this.currentService) {

      this.configForm.patchValue(this.currentService);
      const _js_origin_uris = this.currentService.js_origin_uris;
      const _redirect_uris = this.currentService.redirect_uris;

      this.jsOriginUrisFormArray.clear();
      _js_origin_uris.forEach(uri => {
        const group = this.newUriFormGroup(uri, true);
        this.jsOriginUrisFormArray.push(group);
      })

      const jsItem = this.newUriFormGroup(null, false);
      this.jsOriginUrisFormArray.push(jsItem);

      this.redirectUrisFormArray.clear();
      _redirect_uris.forEach(uri => {
        const group = this.newUriFormGroup(uri, true);
        this.redirectUrisFormArray.push(group);
      })

      const uriItem = this.newUriFormGroup(null, false);
      this.redirectUrisFormArray.push(uriItem);

      this.configForm.markAsPristine();
    }
  }

  private async getServiceOne() {
    if (this.currentApp) {
      const clientId = this.currentApp?.client_id;
      const response = await this._srvService.getApplicationServiceOne(clientId, this.serviceName).toPromise();
      this.showPage = true;
      if (response?.success) {
        this.enabled = true;
        this.currentService = response.Item;
        this.setFormConfigData();
      }
    }
  }

  private listenLoadingEvent() {
    this.isLoading = false;
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }



}
