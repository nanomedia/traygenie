import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationService } from 'src/app/_services/organization.service';
import { MatTable } from '@angular/material/table';
import { BusyService } from 'src/app/_services/busy.service';
import { IInstitutionData, IOrganizationUpdateRequest } from 'src/app/_interfaces/institution.interface';
import { RegexPatterns } from 'src/app/_shared/regexPatterns';
import { MessageService } from 'src/app/_shared/services/message.service';
import { ICatalogAdmin } from 'src/app/_interfaces/catalog.interface';

@Component({
  selector: 'app-editarinstitucion',
  templateUrl: './editarinstitucion.component.html',
  styleUrls: ['./editarinstitucion.component.scss']
})
export class EditarinstitucionComponent implements OnInit {

  private institutionId: string | null;
  private institutionData: IInstitutionData | null;
  formGroup: FormGroup | null;
  private _unsubscribeAll: Subject<any>;

  showPage = false;
  isLoading = false;
  isServiceLoading = false;
  displayedColumns = ['id', 'servicio', 'habilitado', 'bloqueado'];

  @ViewChild(MatTable) _matTable: MatTable<any>;


  constructor(
    private _messageService: MessageService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _organizationService: OrganizationService,
    private _busyService: BusyService,
  ) {
    this._unsubscribeAll = new Subject();
    this.getInstitutionId();
  }

  ngOnInit(): void {
    this.createForm();
    this.listenLoadingEvent();
    this.getServicesList();
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

  save() {
    // const dialogRef = this.dialog.open(PopupConfirmComponent, {
    //   data: {
    //     title: 'Actualizar Institución',
    //     question: '¿Estás seguro que deseas actualizar?'
    //   },
    //   width: '450px'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //   }
    // });
    this.update();
  }

  private async update() {
    if (!this.formGroup.valid) { return false }
    const formValue = this.formGroup.value;
    const request: IOrganizationUpdateRequest = {
      id: this.institutionId,
      acronym: formValue.acronym,
      domains: formValue.domains
        .filter(item => item?.domain !== null && item?.domain?.trim().length > 0)
        .map((item: any) => (item.domain)).join(','),
      services: formValue.services.map(({ code, enabled, blocked }) => ({ code, enabled, blocked }))
    }
    const response = await this._organizationService.putAdminOrganizationUpdate(request).toPromise();

    if (response.success) {
      this._messageService.showSuccessRegister();
      this.cancelar();
    } else if (response?.error) {
      this._messageService.showWarning(response?.error.message);
    }
  }

  cancelar() {
    this.router.navigate(['/admin/institutions']);
  }

  get getServiceArrayForm() {
    return this.formGroup.get('services') as FormArray;
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


  private async createForm() {
    this.formGroup = this._formBuilder.group({
      code: [null],
      name: [null],
      acronym: [null, [Validators.required, Validators.maxLength(100)]],
      domains: new FormArray([]),
      services: new FormArray([])
    });
    this.formGroup.controls['code'].disable();
    this.formGroup.controls['name'].disable();
  }


  private async getInstitution() {
    if (!this.institutionId) {
      this.cancelar();
    } else {
      const response = await this._organizationService.getAdminOrganizationInfo(this.institutionId).toPromise();
      if (response.success) {
        this.institutionData = response.data;
        this.setInstitutionForm();
      }
      this.showPage = true;
    }
  }

  private setInstitutionForm() {
    const item = this.institutionData;

    if (item?.organization) {
      const _org = item.organization;
      this.formGroup.get('code').setValue(_org.code);
      this.formGroup.get('name').setValue(_org.name);
      this.formGroup.get('acronym').setValue(_org.acronym);

      _org.domains.forEach(domain => {
        this.domainFormArray.push(this.newDomainFormGroup(domain));
      })

      if (_org.domains.length < 3) {
        this.domainFormArray.push(this.newDomainFormGroup(null));
      }
    }

    if (item?.services) {
      const controls = this.getServiceArrayForm;
      controls.controls.forEach((ctrl: FormGroup) => {
        const _serviceValue = item.services.filter(x => x.service_code === ctrl.controls['code'].value)

        if (_serviceValue) {
          ctrl.controls['enabled'].setValue(_serviceValue[0].enabled);
          ctrl.controls['blocked'].setValue(_serviceValue[0].blocked);
        }
      })

      this._matTable?.renderRows();
    }
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

    this.getInstitution();
  }

  isInValidField(strField: string): boolean {
    const field = this.formGroup.get(strField);
    return field.invalid && field.touched;
  }

  private getInstitutionId() {
    this.institutionId = this.activatedRoute.snapshot.paramMap.get('id') ?? null;
  }
}
