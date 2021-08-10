import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IOrganizationUpdateRequest } from 'src/app/_interfaces/institution.interface';
import { Router } from '@angular/router';
import { BusyService } from 'src/app/_services/busy.service';
import { takeUntil } from 'rxjs/operators';
import { OrganizationService } from 'src/app/_services/organization.service';
import { RegexPatterns } from 'src/app/_shared/regexPatterns';
import { MessageService } from 'src/app/_shared/services/message.service';
import { ICatalogAdmin } from 'src/app/_interfaces/catalog.interface';

@Component({
  selector: 'app-nuevainstitucion',
  templateUrl: './nuevainstitucion.component.html',
  styleUrls: ['./nuevainstitucion.component.scss']
})
export class NuevainstitucionComponent implements OnInit {

  showPage = false;
  isLoading = false;
  isServiceLoading = false;
  formGroup: FormGroup | null;
  private _unsubscribeAll: Subject<any>;
  @ViewChild(MatTable) _matTable: MatTable<any>;

  displayedColumns = ['id', 'servicio', 'habilitado', 'bloqueado'];

  constructor(
    private _messageService: MessageService,
    private _busyService: BusyService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _organizationService: OrganizationService,
    private router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  ngOnInit() {
    this.listenLoadingEvent();
    this.createForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  async orgSearch() {
    if (this.isLoading) { return false; }
    if (this.isInValidField('code')) { return false; }

    const _code = this.formGroup.controls['code'].value;

    if (_code == null || _code?.length < 11) {
      this.formGroup.get('token').setValue(null);
      this._messageService.showWarning('Debe de ingresar un RUC válido.');
      return false;
    }

    if (_code) {
      const response = await this._organizationService.getAdminOrganizationSearch(_code).toPromise();
      if (response?.success) {
        const helper = new JwtHelperService();
        const rucItem: { ruc, name } = helper.decodeToken(response.token);

        this.formGroup.get('token').setValue(response.token);
        this.formGroup.get('code').setValue(rucItem.ruc);
        this.formGroup.get('name').setValue(rucItem.name);
        this.formGroup.controls['acronym'].enable();
        this.formGroup.controls['domains'].enable();

      } else if (response?.error) {
        this._messageService.showWarning(response?.error.message);
      } else {
        this._messageService.showWarning('Debe de ingresar un RUC válido.');
      }
    }
  }

  save() {
    this.insert();
  }

  cancel() {
    this.router.navigate(['/admin/institutions']);
  }


  private async insert() {
    if (!this.formGroup.valid) { return false; }

    const formValue = this.formGroup.value;
    const request: IOrganizationUpdateRequest = {
      token: formValue.token,
      acronym: formValue.acronym,
      domains: formValue.domains
        .filter(item => item?.domain !== null && item?.domain?.trim().length > 0)
        .map((item: any) => (item.domain)).join(','),

      services: formValue.services.map(({ code, enabled, blocked }) => ({ code, enabled, blocked }))
    }
    const _response = await this._organizationService.postAdminOrganizationInsert(request).toPromise();
    if (_response.success) {
      this._messageService.showSuccessRegister();
      this.cancel();
    } else if (_response?.error) {
      this._messageService.showWarning(_response?.error.message);
    }
  }

  private createForm() {
    this.formGroup = this._formBuilder.group({
      code: [null, [Validators.required, Validators.pattern(RegexPatterns.RUC)]],
      token: [null, [Validators.required]],
      name: [null, [Validators.required]],
      acronym: [null, [Validators.required, Validators.maxLength(100)]],
      domains: new FormArray([this.newDomainFormGroup(null)]),
      services: new FormArray([])
    });

    this.formGroup.controls['name'].disable();
    this.formGroup.controls['acronym'].disable();
    this.formGroup.controls['domains'].disable();

    this.getServicesList();

  }


  get domainFormArray(): FormArray {
    return this.formGroup.get('domains') as FormArray;
  }

  addDomain(item: FormGroup) {
    const isTouched = item.controls['isTouched'].value;
    const length = (this.domainFormArray.value as []).length;
    if (!isTouched && length < 3) {
      this.domainFormArray.push(this.newDomainFormGroup(null));
    }

    item.controls['isTouched'].setValue(true);

  }

  private newDomainFormGroup(domain: string) {
    return this._formBuilder.group(
      {
        domain: [domain, [Validators.pattern(RegexPatterns.DOMAIN)]],
        isTouched: [false]
      });
  }


  isDomainErrorByCtrl(control: FormControl) {
    return control.invalid;
  }

  isInValidField(strField: string): boolean {
    const field = this.formGroup.get(strField);
    return field.invalid && field.touched;
  }


  async getServicesList() {
    this.isServiceLoading = true;
    const response = await this._organizationService.getAdminCatalogAdmin('services');
    const services = response.filter(item => item.category === 'services');
    const _services =services?.sort((a: ICatalogAdmin, b: ICatalogAdmin) => (a.order > b.order) ? 1 : -1);
    const controls = this.getServiceArrayForm;

    _services.forEach((service, index) => {
      controls.push(this._formBuilder.group({
        num: [index + 1],
        code: [service.code],
        value: [service.value],
        enabled: [false],
        blocked: [false]
      }))
    });

    this._matTable?.renderRows();
    this.isServiceLoading = false;
    this.showPage = true;
  }

  get getServiceArrayForm() {
    return this.formGroup.get('services') as FormArray;
  }


}

