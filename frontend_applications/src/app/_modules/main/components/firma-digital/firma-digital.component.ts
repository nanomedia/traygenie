import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAppOneResponse } from 'src/app/_interfaces/application.interface';
import { IServiceOneResponse, IServiceUpdateRequest } from 'src/app/_interfaces/service.interface';
import { ApplicationService } from 'src/app/_services/application.service';
import { BusyService } from 'src/app/_services/busy.service';
import { ServiceService } from 'src/app/_services/service.service';
import { BaseComponent } from '../base/base.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegexPatterns } from 'src/app/_shared/regexPatterns';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from '../../../../_shared/services/message.service';


@Component({
  selector: 'app-firma-digital',
  templateUrl: './firma-digital.component.html',
  styleUrls: ['./firma-digital.component.scss']
})
export class FirmaDigitalComponent extends BaseComponent implements OnInit {

  isLoading = false;
  enabled = false;
  showPage = false;
  configForm: FormGroup | null;

  currentService: IServiceOneResponse | null;
  currentApp: IAppOneResponse | null;

  private serviceName = 'sign_digital';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private _srvService: ServiceService,
    private _busyService: BusyService,
    public appService: ApplicationService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) {

    super(appService, activatedRoute, router);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.listenLoadingEvent();
    this.createForms();
    this.getApplicationData();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }



  createForms() {

    this.configForm = this._formBuilder.group({

      _js_origin_uris: this._formBuilder.array(
        [
          this.newUriFormGroup(null, false),
          this.newUriFormGroup(null, false)
        ])
    });

  }

  get jsOriginUrisFormArray(): FormArray {
    return this.configForm.get('_js_origin_uris') as FormArray;
  }

  isUrlErrorByCtrl(control: FormControl) {
    return control.invalid;
  }

  getformArray(arrayName: string) {
    return (this.configForm.controls[arrayName] as FormArray).controls;
  }

  async save() {
    const formValue = this.configForm.value;
    const id = this.currentService._id;
    const service_code = this.currentService.service_code;

    const js_origin_uris = (formValue._js_origin_uris as [])
      .filter((x: { uri }) => x.uri !== null)
      .map((x: { uri }) => x.uri.trim()).join(',');

    const request: IServiceUpdateRequest = { id, service_code, js_origin_uris };

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

  private newUriFormGroup(uri: string, isTouched: boolean) {
    return this._formBuilder.group(
      {
        uri: [uri, [Validators.pattern(RegexPatterns.URL)]],
        isTouched: [isTouched]
      });
  }


  addUri(item: FormGroup, arrayName: string) {
    const isTouched = item.controls['isTouched'].value;

    if (!isTouched && this.getformArray(arrayName).length < 20) {
      const array = this.configForm.controls[arrayName] as FormArray;
      const groupItem = this.newUriFormGroup(null, false);
      array.push(groupItem);
    }

    item.controls['isTouched'].setValue(true);

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


  private setFormConfigData() {

    if (this.currentService) {

      const _js_origin_uris = this.currentService.js_origin_uris;

      this.jsOriginUrisFormArray.clear();
      _js_origin_uris.forEach(uri => {
        const group = this.newUriFormGroup(uri, true);
        this.jsOriginUrisFormArray.push(group);
      })

      if (_js_origin_uris.length == 0) {
        this.jsOriginUrisFormArray.push(this.newUriFormGroup(null, true));
      }

      this.jsOriginUrisFormArray.push(this.newUriFormGroup(null, false));
      this.configForm.markAsPristine();
    }
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

}
