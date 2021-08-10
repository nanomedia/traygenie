import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BusyService } from '../../../_services/busy.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {


  innerWidth: string = '0px';
  loading$: Observable<boolean>;
  constructor(private _busyService: BusyService) {
    this.loading$ = _busyService.loading;
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth + 'px';
  }

}
