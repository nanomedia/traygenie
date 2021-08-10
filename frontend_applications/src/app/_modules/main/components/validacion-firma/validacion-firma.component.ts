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
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { RegexPatterns } from 'src/app/_shared/regexPatterns';
import { MessageService } from '../../../../_shared/services/message.service';


@Component({
  selector: 'app-validacion-firma',
  templateUrl: './validacion-firma.component.html',
  styleUrls: ['./validacion-firma.component.scss']
})
export class ValidacionFirmaComponent extends BaseComponent implements OnInit {

  isLoading = false;
  enabled = false;
  showPage = false;

  currentService: IServiceOneResponse | null;
  currentApp: IAppOneResponse | null;
  configForm: FormGroup | null;

  private serviceName = 'sign_validation';
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
    this.createForm();
    this.getApplicationData();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }



  createForm() {

    this.configForm = this._formBuilder.group({

      _macs: this._formBuilder.array(
        [
          this.newMacFormGroup(null, false),
          this.newMacFormGroup(null, false)
        ])
    });

  }

  private newMacFormGroup(uri: string, isTouched: boolean) {
    return this._formBuilder.group(
      {
        mac: [uri, [Validators.pattern(RegexPatterns.MAC)]],
        isTouched: [isTouched]
      });
  }



  async save() {
    if (this.configForm.invalid) {
      return false;
    }
    const formValue = this.configForm.value;
    const id = this.currentService._id;
    const service_code = this.currentService.service_code;

    const mac_authorized = (formValue._macs as [])
      .filter((x: { mac }) => x.mac !== null)
      .map((x: { mac }) => x.mac.trim()).join(',');

    const request: IServiceUpdateRequest = { id, service_code, mac_authorized };
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

  addMac(item: FormGroup, arrayName: string) {
    const isTouched = item.controls['isTouched'].value;

    if (!isTouched && this.getformArray(arrayName).length < 20) {
      const array = this.configForm.controls[arrayName] as FormArray;
      const groupItem = this.newMacFormGroup(null, false);
      array.push(groupItem);
    }

    item.controls['isTouched'].setValue(true);

  }

  isUrlErrorByCtrl(control: FormControl) {
    return control.invalid;
  }

  getformArray(arrayName: string) {
    return (this.configForm.controls[arrayName] as FormArray).controls;
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

      const _macs = this.currentService.mac_authorized || [];

      this.macsFormArray.clear();
      _macs.forEach(mac => {
        this.macsFormArray.push(this.newMacFormGroup(mac, true));
      });

      if (_macs.length == 0) {
        this.macsFormArray.push(this.newMacFormGroup(null, true));
      }

      this.macsFormArray.push(this.newMacFormGroup(null, false));
      this.configForm.markAsPristine();
    }
  }
  get macsFormArray(): FormArray {
    return this.configForm.get('_macs') as FormArray;
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

}
