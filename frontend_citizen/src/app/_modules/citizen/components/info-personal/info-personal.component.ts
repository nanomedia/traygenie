import { Component, OnInit } from '@angular/core';
import { CitizenService } from '../../../../_services/citizen.service';
import { IProfileResponse } from '../../../../_interfaces/profile.interface';
import { Subject } from 'rxjs';
import { BusyService } from 'src/app/_services/busy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-info-personal',
  templateUrl: './info-personal.component.html',
  styleUrls: ['./info-personal.component.scss']
})
export class InfoPersonalComponent implements OnInit {
  
  isLoading: boolean;
  profile: IProfileResponse | null;
  
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _busyService: BusyService,
    private _citizenService: CitizenService) { }

  ngOnInit(): void {
    this._unsubscribeAll = new Subject();
    this.listenLoadingEvent();
    this.getProfile();
  }

  async getProfile() {
    const response = await this._citizenService.getProfile().toPromise();
    if (response.success) {
      this.profile = response.Item;
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
