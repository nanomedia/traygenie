import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RegexPatterns } from 'src/app/_shared/regexPatterns';
import { BusyService } from 'src/app/_services/busy.service';
import { IManagerInsertRequest } from 'src/app/_interfaces/manager.interface';
import { ManagerService } from 'src/app/_services/manager.service';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-nuevojefeproyectos',
  templateUrl: './nuevojefeproyectos.component.html',
  styleUrls: ['./nuevojefeproyectos.component.scss']
})
export class NuevojefeproyectosComponent implements OnInit {

  formGroup: FormGroup | null;

  private organizationCode: string | null;
  private token: string | null;
  private _unsubscribeAll: Subject<any>;

  isLoading = false;
  isSaving = false;
  showPage = false;

  constructor(
    private _messageService: MessageService,
    private _busyService: BusyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private _managerService: ManagerService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.listenLoadingEvent();
    this.getOrgCode();
    this.createForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  isInValidField(strField: string): boolean {
    const field = this.formGroup.get(strField);
    return field.invalid && field.touched;
  }


  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  async save() {
    if (this.formGroup.valid) {
      const _formData: { phone, email, position } = this.formGroup.value;
      const _request: IManagerInsertRequest = {
        organization_code: this.organizationCode,
        token: this.token,
        phone: _formData.phone,
        email: _formData.email,
        position: _formData.position
      };
      this.isSaving = true;

      const _response = await this._managerService
        .postAdminManagerInsert(_request).toPromise();

      if (_response.success) {
        this.isSaving = false;
        this._messageService.showSuccessRegister();
        this.cancel();
      } 
      else if (_response?.error) {
        this._messageService.showWarning(_response?.error.message);
      }
    }
  }


  private createForm() {
    this.formGroup = this._formBuilder.group({
      docFilter: [null, [Validators.required, Validators.pattern(RegexPatterns.DNI)]],
      token: [null, [Validators.required]],
      name: [null],
      lastName: [null],
      phone: [null, [Validators.required, Validators.pattern(RegexPatterns.CELULAR)]],
      email: [null, [Validators.required, Validators.pattern(RegexPatterns.EMAIL)]],
      position: [null, [Validators.required, Validators.maxLength(200)]],
    });

    this.formGroup.controls['name'].disable();
    this.formGroup.controls['lastName'].disable();
  }

  async buscarDNI() {
    if (this.isLoading) { return false; }
    if (this.isInValidField('docFilter')) { return false; }

    const docFilter = this.formGroup.controls['docFilter'].value;
    const _docFilter: string = docFilter?.trim();

    if (_docFilter == null || _docFilter?.length < 8) {
      this.formGroup.get('token').setValue(null);
      this._messageService.showWarning('Debe de ingresar un DNI válido.');
      return false;
    }

    const response = await this._managerService.getAdminManagerSearch(docFilter).toPromise();

    if (response?.success) {
      this.token = response.token;
      const helper = new JwtHelperService();
      const personItem: { name, lastname_1, lastname_2, lastname_3 } = helper.decodeToken(response.token);
      const _lastNameArray = [personItem.lastname_1, personItem.lastname_2, personItem.lastname_3];
      const lastName = _lastNameArray.join(' ');

      
      const extraData = response.data ?? null;
      const phone = extraData?.phone ?? null;
      const email = extraData?.email ?? null;
      const position = extraData?.position ?? null;

      this.formGroup.get('phone').setValue(phone);
      this.formGroup.get('email').setValue(email);
      this.formGroup.get('position').setValue(position);

      this.formGroup.get('name').setValue(personItem.name);
      this.formGroup.get('lastName').setValue(lastName?.trim());
      this.formGroup.get('token').setValue(this.token);
    } else if (response?.error) {
      this._messageService.showWarning(response?.error.message);
    } else {
      this._messageService.showWarning('Debe de ingresar un DNI válido.');
    }
  }


  private getOrgCode() {

    this.organizationCode = this.activatedRoute.snapshot.paramMap.get('code') ?? null;
    if (!this.organizationCode) {
      this.cancel();
    }
    this.showPage = true;
  }

  cancel() {
    const _orgCode = this.organizationCode;
    this.router.navigate(['/admin/institutions/project-manager', _orgCode]);
  }

}
