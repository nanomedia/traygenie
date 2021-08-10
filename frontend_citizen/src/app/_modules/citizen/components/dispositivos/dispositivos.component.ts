import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from 'src/app/_services/busy.service';
import { CitizenService } from 'src/app/_services/citizen.service';
import { IDeviceResponse } from '../../../../_interfaces/device.interface';

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.scss']
})
export class DispositivosComponent implements OnInit {

  isLoading: boolean;
  devices: IDeviceResponse[] | null;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _busyService: BusyService,
    private _citizenService: CitizenService) { }

  ngOnInit(): void {
    this._unsubscribeAll = new Subject();
    this.listenLoadingEvent();
    this.getDevices();
  }

  getIcon(icon: string) {

    const icons = [
      { filters: ['chrome', 'android'], icon: 'chrome.svg' },
      { filters: ['apple', 'mac','opera'], icon: 'opera.svg' },
      { filters: ['window', 'ie', 'edge', 'microsoft'], icon: 'edge.svg' },
      { filters: ['firefox'], icon: 'firefox.svg' },
    ];

    const item = icons.find(x => x.filters.some(y => icon.toLowerCase().includes(y)));

    return item?.icon || '';
  }

  async getDevices() {
    const response = await this._citizenService.getDevices().toPromise();
    if (response.success) {
      this.devices = response.Items;
      this.devices = this.devices.sort((a: IDeviceResponse, b: IDeviceResponse) => {
        return new Date(b.auth_time).getTime() - new Date(a.auth_time).getTime();
      });
    }
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe((x: boolean) => {
      this.isLoading = x;
    });
  }

}
