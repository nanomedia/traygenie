import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApplicationService } from '../../../_services/application.service';
import { Subject } from 'rxjs';
import { BusyService } from 'src/app/_services/busy.service';
import { Router } from '@angular/router';
import { IAppItemResponse } from 'src/app/_interfaces/application.interface';
import { IPagination } from 'src/app/_interfaces/pagination.interface';
import { takeUntil } from 'rxjs/operators';
import { IAppOneResponse } from '../../../_interfaces/application.interface';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-app-demo',
  templateUrl: './app-demo.component.html',
  styleUrls: ['./app-demo.component.scss']
})
export class AppDemoComponent implements OnInit {

  displayedColumns = ['num', 'nombre', 'fecha', 'opt'];

  private _unsubscribeAll: Subject<any>;
  dataSource: IPagination<IAppItemResponse>;
  page = 1;
  count = 5;
  formGroup: FormGroup | null;
  _isLoading = false;
  private isDesktopDevice: boolean;

  constructor(
    private deviceService: DeviceDetectorService,
    private _busyService: BusyService,
    private _appService: ApplicationService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<AppDemoComponent>,) {
    this._unsubscribeAll = new Subject();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.listenLoadingEvent();
  }

  ngAfterViewInit() {
    setTimeout(() => this.buscar());
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  private listenLoadingEvent() {

    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this._isLoading = x;
    });
  }


  buscar() {

    if (this._isLoading) { return false; }

    this.page = 1;
    this.count = 5;
    this.getDataSource();
  }

  getRowNumber(index: number) {
    return this.page == 1 ? index + 1 : 1 + index + (this.page - 1) * this.count;
  }

  goToAppMobile(item: IAppItemResponse) {
    //console.log(this.isDesktopDevice)
    if (!this.isDesktopDevice) {
      this.goToApp(item);
    }
  }

  async goToApp(item: IAppItemResponse) {
    
    this.dialogRef.close();
    const id = this._appService.getAppCurrentSubjet().getValue();

    if (id !== item._id) {
      this._appService.setAppCurrentId(item._id);
      const _item: IAppOneResponse = { _id: item._id, client_id: item.client_id, name: item.name };
      this._appService.setCurrentApp(_item);
      this._appService.setServicesSource(null);

      const response = await this._appService
        .getApplicationOrganizationServices(item._id)
        .toPromise();

      if (response?.success) {
        const services = response.service ?? null;
        if (services) {
          this._appService.setServicesSource(services);
        }
        this.router.navigate(['/main/inicio-app', item._id]);
      }
    }
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

    const data = await this._appService
      .getApplicationApp(word, this.page, this.count)
      .toPromise();

    this.dataSource = data;
  }


  get pageIndex() {
    return this.page < 0 ? 0 : (this.page - 1);
  }

  pageEvent(page: any) {
    this.page = page.pageIndex + 1;
    this.count = page.pageSize;
    this.getDataSource();
  }

}

