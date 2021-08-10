
import { Component } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IOrganization } from 'src/app/_interfaces/institution.interface';
import { IPagination } from 'src/app/_interfaces/pagination.interface';
import { OrganizationService } from 'src/app/_services/organization.service';
import { BusyService } from 'src/app/_services/busy.service';


@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.scss']
})
export class InstitucionesComponent {

  displayedColumns = ['num', 'ruc', 'nombre', 'fecha', 'opciones'];
  dataSource: IPagination<IOrganization>;
  page = 1;
  count = 5;

  showPage = false;
  isLoading: boolean;


  formGroup: FormGroup | null;

  private _unsubscribeAll: Subject<any>;

  constructor(private _organizationService: OrganizationService,
    private _busyService: BusyService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit() {
    this.listenLoadingEvent();
    this.createFormGroup();
    this.getDataSource();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  async getDataSource() {
    const _word = this.formGroup.get('filter').value;
    const word = this.getFilterValue(_word);
    const data = await this._organizationService
      .getAdminOrganization(word, this.page, this.count)
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

  getRowNumber(index: number) {
    return this.page == 1 ? index + 1 : 1 + index + (this.page - 1) * this.count;
  }

  edit(institution: IOrganization) {
    const _id = institution._id;
    this._router.navigate(['/admin/institutions/edit', _id]);
  }
  
  editProjectManager(institution: IOrganization) {
    const _orgCode = institution.code;
    const name = institution.name;
    this._router.navigate(['/admin/institutions/project-manager', _orgCode], { state: { name } });
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





