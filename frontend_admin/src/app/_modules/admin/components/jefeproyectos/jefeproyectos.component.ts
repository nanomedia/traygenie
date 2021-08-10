import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { IPagination } from 'src/app/_interfaces/pagination.interface';
import { BusyService } from 'src/app/_services/busy.service';
import { IManagerItem } from 'src/app/_interfaces/manager.interface';
import { ManagerService } from 'src/app/_services/manager.service';
import { PopupTextValidateComponent } from 'src/app/_shared/components/popup-text-validate/popup-text-validate.component';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-jefeproyectos',
  templateUrl: './jefeproyectos.component.html',
  styleUrls: ['./jefeproyectos.component.scss']
})
export class JefeproyectosComponent implements OnInit {
  private orgCode: string | null;
  private orgName: string | null;
  private _unsubscribeAll: Subject<any>;

  showPage = false;
  dataSource: IPagination<IManagerItem>;
  page = 1;
  count = 5;
  displayedColumns = ['num', 'dni', 'nombre', 'apellidos', 'correo', 'celular', 'fecha', 'opciones'];
  formGroup: FormGroup | null;
  isLoading = false;
  constructor(
    private _messageService: MessageService,
    private _busyService: BusyService,
    private _managerService: ManagerService,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    this.createFormGroup();
    this.listenLoadingEvent();
    this.getInstitutionId();
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

  delete(item: IManagerItem) {
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
      maxWidth: '850px'
    });


    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const _response = await this._managerService.delAdminManagerDelete(item._id).toPromise();
        if (_response.success) {
          this.buscar();
          this._messageService.showSuccessDelete();
        }
      }
    });
  }


  newProjectManager() {
    const _orgCode = this.orgCode;
    this.router.navigate(['/admin/institutions/new-project-manager', _orgCode]);
  }

  edit(item: IManagerItem) {
    const _id = item._id;
    const _orgCode = this.orgCode;
    this.router.navigate(['/admin/institutions/edit-project-manager', _orgCode, _id]);
  }
  getRowNumber(index: number) {
    return this.page == 1 ? index + 1 : 1 + index + (this.page - 1) * this.count;
  }
  buscar() {
    this.page = 1;
    this.count = 5;
    this.getDataSource();
  }


  private createFormGroup() {
    this.formGroup = this._formBuilder.group({
      filter: [null]
    })
  }

  private getFilterValue(filterValue: string) {
    filterValue = filterValue?.trim();
    filterValue = filterValue?.toLowerCase();
    return filterValue;
  }


  private async getDataSource() {
    const _word = this.formGroup.get('filter').value;
    const word = this.getFilterValue(_word);

    if (!this.orgCode) {
      this.router.navigate(['/admin/institutions']);
      return false;
    }

    const data = await this._managerService
      .getAdminOrganization(this.orgCode, word, this.page, this.count)
      .toPromise();
    this.dataSource = data;
    this.showPage = true;
  }


  get pageIndex() {
    return this.page < 0 ? 0 : (this.page - 1);
  }

  pageEvent(page: any) {
    this.page = page.pageIndex + 1;
    this.count = page.pageSize;
    this.getDataSource();
  }


  private getInstitutionId() {
    this.orgCode = this.activatedRoute.snapshot.paramMap.get('code') ?? null;
    if (this.orgCode) {
      this.getInstitutionName();
      this.getDataSource();
    }
  }

  private getInstitutionName() {
    this.activatedRoute.params
      .pipe(map(() => window.history.state))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(x => {
        this.orgName = x.name ?? null;
      });
  }

}
