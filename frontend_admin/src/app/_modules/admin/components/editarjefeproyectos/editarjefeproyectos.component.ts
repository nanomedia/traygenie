import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerService } from 'src/app/_services/manager.service';
import { map, takeUntil } from 'rxjs/operators';
import { IManagerItem, IManagerUpdateRequest } from 'src/app/_interfaces/manager.interface';
import { BusyService } from 'src/app/_services/busy.service';
import { RegexPatterns } from 'src/app/_shared/regexPatterns';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupConfirmComponent } from 'src/app/_shared/components/popup-confirm/popup-confirm.component';
import { PopupTextValidateComponent } from 'src/app/_shared/components/popup-text-validate/popup-text-validate.component';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-editarjefeproyectos',
  templateUrl: './editarjefeproyectos.component.html',
  styleUrls: ['./editarjefeproyectos.component.scss']
})
export class EditarjefeproyectosComponent implements OnInit {
  formGroup: FormGroup | null;
  isLoading: boolean;

  isSaving: boolean;
  showPage: boolean;


  private projectManager: IManagerItem | null;
  private projectManagerId: string | null;
  private organizationCode: string | null;
  private organizationName: string | null;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _messageService: MessageService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private _managerService: ManagerService,
    private _busyService: BusyService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.createForm();
    this.listenLoadingEvent();
    this.getProjectManagerId();
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


  private createForm() {
    this.formGroup = this._formBuilder.group({
      docFilter: [null],
      name: [null],
      lastName: [null],
      phone: [null, [Validators.required, Validators.pattern(RegexPatterns.CELULAR)]],
      email: [null, [Validators.required, Validators.pattern(RegexPatterns.EMAIL)]],
      position: [null, [Validators.required, Validators.maxLength(200)]],
    });

    this.formGroup.controls['docFilter'].disable();
    this.formGroup.controls['name'].disable();
    this.formGroup.controls['lastName'].disable();
  }

  private getProjectManagerId() {
    this.organizationCode = this.activatedRoute.snapshot.paramMap.get('code') ?? null;
    this.projectManagerId = this.activatedRoute.snapshot.paramMap.get('id') ?? null;
    this.getProjectManager();
  }

  private async getProjectManager() {
    const _id = this.projectManagerId;
    const _code = this.organizationCode;
    if (!_id || !_code) {
      this.router.navigate(['/admin/institutions']);
      return false;
    }
    const response = await this._managerService.getAdminManagerOne(_id).toPromise();

    if (response.success) {
      this.projectManager = response.Item;
      const _lastName = `${this.projectManager.lastname_1} ${this.projectManager.lastname_2} ${this.projectManager.lastname_3}`;

      this.formGroup.get('docFilter').setValue(this.projectManager.doc);
      this.formGroup.get('name').setValue(this.projectManager.names);
      this.formGroup.get('lastName').setValue(_lastName);
      this.formGroup.get('phone').setValue(this.projectManager.phone);
      this.formGroup.get('email').setValue(this.projectManager.email);
      this.formGroup.get('position').setValue(this.projectManager.position);
    }
    this.showPage = true;
  }


  cancel() {
    const _orgCode = this.organizationCode;
    this.router.navigate(['/admin/institutions/project-manager', _orgCode]);
  }


  save() {
    this.update();
  }
  private async update() {
    if (this.projectManager) {

      const request: IManagerUpdateRequest = {
        id: this.projectManagerId,
        email: this.formGroup.value.email,
        phone: this.formGroup.value.phone,
        position: this.formGroup.value.position
      }
      this.isSaving = true;
      const _response = await this._managerService.putAdminManagerUpdate(request).toPromise();
      if (_response.success) {
        this.isSaving = false;
        this._messageService.showSuccessRegister();
        this.cancel();
      } else if (_response?.error) {
        this._messageService.showWarning(_response?.error.message);
      }
    }
  }


  delete() {
    const item = this.projectManager;
    const _name = [item.names, item.lastname_1, item.lastname_2, item.lastname_3];
    const name = _name.join(' ');

    const dialogRef = this.dialog.open(PopupTextValidateComponent, {
      data: {
        title: `Eliminar al jefe de proyectos`,
        question: `¿Estás seguro que deseas eliminar al jefe de proyectos?`,
        confirmQuestion: `Para confirmar, ingresa el nombre del jefe de proyectos`,
        field: `Nombre del jefe de proyectos`,
        fieldData: name
      },
      width: '98%',
      maxWidth: '450px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const _response = await this._managerService.delAdminManagerDelete(item._id).toPromise();
        if (_response.success) {
          this._messageService.showSuccessDelete();
          this.cancel();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
