
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPagination } from 'src/app/_interfaces/pagination.interface';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BusyService } from 'src/app/_services/busy.service';
import { IVersionRequest, IVersionResponse } from 'src/app/_interfaces/version.interface';
import { VersionService } from 'src/app/_services/version.service';
import { VersionComponent } from '../version/version.component';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-versiones',
  templateUrl: './versiones.component.html',
  styleUrls: ['./versiones.component.scss']
})
export class VersionesComponent implements OnInit {

  page = 1;
  count = 5;
  showPage: boolean;
  isLoading: boolean;
  isTableLoading: boolean;
  dataSource: IPagination<IVersionResponse>;
  displayedColumns = ['num', 'version', 'codigo', 'fecha', 'habilitado', 'opciones'];

  private service_code: string | null;
  private _unsubscribeAll: Subject<any>;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _messageService: MessageService,
    private _versionService: VersionService,
    private _busyService: BusyService
  ) {
    this._unsubscribeAll = new Subject();
    this.getServiceId();
  }

  ngOnInit() {
    this.listenLoadingEvent();
    this.getVersionsList();
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


  private getServiceId() {
    this.service_code = this.activatedRoute.snapshot.paramMap.get('code') ?? null;
  }

  private async getVersionsList() {
    if (!this.service_code) {
      this.router.navigate(['/admin/institutions/services']);
    } else {
      this.getDataSource();
    }
  }

  private async getDataSource() {
    this.isTableLoading = true;
    const response = await this._versionService
      .getAdminVersion(this.service_code, null, this.page, this.count)
      .toPromise();
    this.isTableLoading = false;

    if (response.success) {
      this.dataSource = response;
    }

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

  getRowNumber(index: number) {
    return this.page == 1 ? index + 1 : 1 + index + (this.page - 1) * this.count;
  }


  new() {
    const dialogRef = this.dialog.open(VersionComponent, {
      data: {
        metodo: 'Nueva'
      },
      width: '98%',
      maxWidth: '450px'
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        if (result && result.version_number) {
          this.insertVersion(result.version_number);
        }
      });
  }

  edit(item: IVersionResponse) {
    const dialogRef = this.dialog.open(VersionComponent, {
      data: {
        version_number: item.version_number,
        metodo: 'Editar'
      },
      width: '98%',
      maxWidth: '450px'
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(result => {
        if (result && result.version_number) {
          const newValue = result.version_number;
          this.updateVersion(item._id, newValue);
        }
      });
  }

  async toggleChange(event: MatSlideToggleChange, row: IVersionResponse) {
    event.source.checked = await this.changeStatus(event.checked, row._id);
  }

  private async changeStatus(value: boolean, id: string): Promise<boolean> {
    const param: IVersionRequest = { value, id };
    const response = await this._versionService.putAdminVersionChangeStatus(param).toPromise();
    if (response?.success) {
      this._messageService.showSuccessRegister();
      return value;
    }
    else if (response?.error) {
      this._messageService.showWarning(response?.error.message);
    }
    return !value;
  }

  private async insertVersion(versionNumber: string) {
    const request: IVersionRequest = { service_code: this.service_code, version_number: versionNumber };
    const response = await this._versionService.postAdminVersionInsert(request).toPromise();

    if (response.success) {

      this._messageService.showSuccessRegister();
      this.getDataSource();
    }
    else if (response?.error) {
      this._messageService.showWarning(response?.error.message);
    }
  }

  private async updateVersion(id: string, version_number: string) {
    const request: IVersionRequest = { id, version_number };
    const response = await this._versionService.putAdminVersionUpdate(request).toPromise();

    if (response.success) {

      this._messageService.showSuccessRegister();

      this.getDataSource();
    }
    else if (response?.error) {
      this._messageService.showWarning(response?.error.message);
    }
  }
}



