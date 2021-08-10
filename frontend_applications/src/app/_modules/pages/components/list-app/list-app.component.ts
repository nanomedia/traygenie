import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BusyService } from 'src/app/_services/busy.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { IPagination } from 'src/app/_interfaces/pagination.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationService } from '../../../../_services/application.service';
import { IAppItemResponse, IAppOneResponse } from 'src/app/_interfaces/application.interface';

@Component({
  selector: 'app-list-app',
  templateUrl: './list-app.component.html',
  styleUrls: ['./list-app.component.scss']
})
export class ListAppComponent implements OnInit {


  dataSource: IPagination<IAppItemResponse>;
  page = 1;
  count = 8;
  isLoading = false;
  formGroup: FormGroup | null;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _appService: ApplicationService,
    private _formBuilder: FormBuilder,
    private _busyService: BusyService,
    private _router: Router) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.listenLoadingEvent();
    this.createFormGroup();
    this.getDataSource();
  }

  async getDataSource() {
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

  async goToApp(item: IAppItemResponse) {
    this._appService.setCurrentApp(null); 
    this._appService.setAppCurrentId(null);
    this._appService.setServicesSource(null);
    this._router.navigate(['/main/inicio-app', item._id]);
    // this._appService.setAppCurrentId(item._id);
    // const _item: IAppOneResponse = { _id: item._id, client_id: item.client_id, name: item.name };
    // this._appService.setCurrentApp(_item);
    // this._appService.setServicesSource(null);

    // const response = await this._appService.getApplicationOrganizationServices(item._id).toPromise();
    // if (response?.success) {
    //   const services = response.service ?? null;
    //   if (services) {
    //     this._appService.setServicesSource(services);
    //   }
    // }
  }

  buscar() {
    if (this.isLoading) { return false }
    this.page = 1;
    this.count = 8;
    this.getDataSource();
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
