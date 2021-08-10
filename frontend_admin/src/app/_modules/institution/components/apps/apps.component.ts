import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { BusyService } from 'src/app/_services/busy.service';
import { Router } from '@angular/router';
import { IPagination } from 'src/app/_interfaces/pagination.interface';
import { takeUntil } from 'rxjs/operators';
import { OrgInfoAppService } from 'src/app/_services/org-info-app.service';
import { IResponse } from 'src/app/_interfaces/response.interface';
import { IServiceItem } from 'src/app/_interfaces/service.interface';
import { PopupTextValidateComponent } from 'src/app/_shared/components/popup-text-validate/popup-text-validate.component';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit {
  dataSource: IPagination<IServiceItem>;
  page = 1;
  count = 5;
  isLoading: boolean;
  showPage: boolean;
  formGroup: FormGroup | null;
  displayedColumns = ['num', 'nombre', 'fecha', 'opciones'];

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _messageService: MessageService,
    public dialog: MatDialog,
    private _orgInfoAppService: OrgInfoAppService,
    private _busyService: BusyService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.createFormGroup();
    this.listenLoadingEvent();
    this.getDataSource();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  async getDataSource() {
    const _word = this.formGroup.get('filter').value;
    const word = this.getFilterValue(_word);
    const data = await this._orgInfoAppService
      .getOrganizationApp(word, this.page, this.count)
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


  edit(item: IServiceItem) {
    const _id = item._id;
    this._router.navigate(['/institution/apps/edit', _id]);
  }
  getRowNumber(index: number) {
    return this.page == 1 ? index + 1 : 1 + index + (this.page - 1) * this.count;
  }

  delete(item: IServiceItem) {
    const dialogRef = this.dialog.open(PopupTextValidateComponent, {
      data: {
        title: `Eliminar aplicación`,
        question: `¿Estás seguro que deseas eliminar la aplicación?`,
        confirmQuestion: `Para confirmar, ingresa el nombre de la aplicación`,
        field: `Nombre de la aplicación`,
        fieldData: item.name
      },
      width: '98%',
      maxWidth: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteApp(item._id);
      }
    });
  }

  private async deleteApp(id: string) {
    const response = await this._orgInfoAppService
      .deleteOrgAppDelete(id)
      .toPromise();

    if (response?.success) {
      this._messageService.showSuccessDelete();
      this.getDataSource();
    }else if (response?.error) {
      this._messageService.showWarning(response?.error.message);
    }
  }

  buscar() {
    if (!this.isLoading) {
      this.page = 1;
      this.count = 5;
      this.getDataSource();
    }
  }

  private createFormGroup() {
    this.formGroup = this._formBuilder.group({
      filter: [null]
    })
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  private getFilterValue(filterValue: string) {
    filterValue = filterValue?.trim();
    filterValue = filterValue?.toLowerCase();
    return filterValue;
  }



}
