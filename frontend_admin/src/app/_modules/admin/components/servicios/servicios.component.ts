
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BusyService } from 'src/app/_services/busy.service';
import { takeUntil } from 'rxjs/operators';
import { ICatalogAdmin } from 'src/app/_interfaces/catalog.interface';
import { OrganizationService } from 'src/app/_services/organization.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {

  dataSource: ICatalogAdmin[] | null;

  isLoading = false;
  showPage: boolean;
  displayedColumns: string[] = ['position', 'servicio', 'event'];
  private _unsubscribeAll: Subject<any>;
  constructor(private _orgService: OrganizationService,
    private router: Router,
    private _busyService: BusyService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.listenLoadingEvent();
    this.getServices();
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

  edit(item: ICatalogAdmin) {
    const _service_code = item.code;
    this.router.navigate(['/admin/services/versions', _service_code]);
  }

  private async getServices() {
    const response = await this._orgService.getAdminCatalogAdmin("services") || [];
    const _services = response?.filter(x => x.category === "services");
    this.dataSource = _services?.sort((a: ICatalogAdmin, b: ICatalogAdmin) => (a.order > b.order) ? 1 : -1);
    this.showPage = true;
  }
}
