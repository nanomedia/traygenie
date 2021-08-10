import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApplicationService } from '../../../../_services/application.service';
import { BaseComponent } from '../base/base.component';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BusyService } from 'src/app/_services/busy.service';
import { IAppUpdateRequest } from '../../../../_interfaces/application.interface';
import { RegexPatterns } from 'src/app/_shared/regexPatterns';
import { ServiceMenuNavigation } from 'src/app/_core/components/layout/menu.data';
import { MenuItem } from '../../../../_interfaces/menu.interface';
import { MessageService } from '../../../../_shared/services/message.service';
import { DatePipe } from '@angular/common';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-inicio-app',
  templateUrl: './inicio-app.component.html',
  styleUrls: ['./inicio-app.component.scss']
})
export class InicioAppComponent extends BaseComponent implements OnInit {


  isLoading = false;
  showPage = false;
  appInfoForm: FormGroup | null;
  orgInfoForm: FormGroup | null;
  devInfoForm: FormGroup | null;
  services: MenuItem[] | null;

  _appId: string | null;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private datepipe: DatePipe,
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private _busyService: BusyService,

    public appService: ApplicationService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {

    super(appService, activatedRoute, router);

    this._unsubscribeAll = new Subject();
  }


  ngOnInit(): void {
    super.ngOnInit();

    this.listenLoadingEvent();
    this.createForm();
    this.getApplicationData();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createForm() {
    this.appInfoForm = this._formBuilder.group({
      client_id: this._formBuilder.control({ value: null, disabled: true }),
      name: [null, [Validators.required, Validators.maxLength(50)]],
      description: [null, [Validators.required, Validators.maxLength(150)]],
      url: [null, [Validators.required, Validators.pattern(RegexPatterns.URL)]],
      logo_url: this._formBuilder.control({ value: null, disabled: true }),
    });

    this.orgInfoForm = this._formBuilder.group({
      code: this._formBuilder.control({ value: null, disabled: true }),
      name: this._formBuilder.control({ value: null, disabled: true }),
      domains: this._formBuilder.array([])
    });

    this.devInfoForm = this._formBuilder.group({
      doc: this._formBuilder.control({ value: null, disabled: true }),
      names: this._formBuilder.control({ value: null, disabled: true }),
      lastname: this._formBuilder.control({ value: null, disabled: true }),
      created_at: this._formBuilder.control({ value: null, disabled: true })
    });
  }

  get domains() {
    return (this.orgInfoForm.controls['domains'] as FormArray)
  }

  async save() {
    if (this.appInfoForm.valid) {

      let { name, description, url } = this.appInfoForm.value;
      name = Base64.encode(name);
      description = Base64.encode(description);
      const request: IAppUpdateRequest = { id: this._appId, name, description, url };
      const response = await this.appService.putApplicationAppUpdate(request).toPromise();

      if (response?.success) {
        this._messageService.showSuccessRegister();
        this.appInfoForm.markAsPristine();

      } else if (response?.error) {
        const error = response?.error;
        this._messageService.showWarning(error.message);
      }

    }
  }

  isInValidField(strField: string): boolean {
    const field = this.appInfoForm.get(strField);
    return field.invalid && field.touched;
  }


  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }


  async getApplicationData() {
    this.appService.getAppCurrentId()
      .pipe(takeUntil(this._unsubscribeAll)).subscribe(async id => {

        if (id) {
          this._appId = id;
          this.getAppInfo(id);
          this.getServiceInfo();
        }

      })

  }

  private async getAppInfo(id: string) {
    const response = await this.appService
      .getApplicationAppInfo(id)
      .toPromise();
    if (response?.success) {
      this.showPage = true;
      const data = response?.data;

      if (data?.app) {
        this.appInfoForm.patchValue(data.app);
      }

      if (data?.organization) {
        this.orgInfoForm.patchValue(data.organization);
        this.domains.clear();
        data.organization.domains.forEach(domain => {
          this.domains.push(
            this._formBuilder.control({ value: domain, disabled: true })
          )
        })
      }

      if (data?.developer) {
        const dev = data.developer;
        dev.created_at = this.datepipe.transform(dev.created_at, 'dd/MM/yyyy HH:mm');
        this.devInfoForm.patchValue(data.developer);
      }
    }
  }
  private async getServiceInfo() {

    this.appService
      .getServicesSource()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(services => {
        if (services) {
          const items = ServiceMenuNavigation.filter(item => services.some(x => x === item.id));
          this.services = items;
        }
      });
  }

}
