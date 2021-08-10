import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter, withLatestFrom, takeUntil } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav/sidenav';
import { ApplicationService } from '../../../_services/application.service';
import { Subject } from 'rxjs';
import { MenuNavigation, ServiceMenuNavigation } from './menu.data';
import { MenuItem } from 'src/app/_interfaces/menu.interface';
import { BusyService } from 'src/app/_services/busy.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  menuItems: MenuItem[] | null;
  serviceItems: MenuItem[] | null;
  appId: string | null;
  isLoading = false;

  private _unsubscribeAll: Subject<any>;
  @ViewChild('drawer') drawer: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall,Breakpoints.Small, Breakpoints.Medium,Breakpoints.Handset])
  .pipe(
    map(result => result.matches)
  );


  reason = '';

  constructor(
    private _busyService: BusyService,
    private _appService: ApplicationService,
    private breakpointObserver: BreakpointObserver,
    private breakpointObserver1: BreakpointObserver,
    private router: Router) {

    this._unsubscribeAll = new Subject();

    this.menuItems = MenuNavigation;

    router.events.pipe(
      withLatestFrom(this.isHandset$),
      filter(([a, b]) => b && a instanceof NavigationEnd)
    ).subscribe(_ => this.drawer?.close());

  }

  public isHandset1$: Observable<boolean> = this.breakpointObserver1
    .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.WebLandscape])
    .pipe(map((result: BreakpointState) => result.matches));


  ngOnInit(): void {
    this.listenLoadingEvent();
    this.getIdApp();
    this.getServiceMenu();
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  close(reason: string) {
    this.reason = reason;
  }

  private async getIdApp() {

    this._appService
    .getAppCurrentId()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(id => {
      this.appId = id;
    });

  }

  private getServiceMenu() {
    this._appService
    .getServicesSource()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(services => {
      if (services) {
        const items = ServiceMenuNavigation.filter(item => services.some(x => x === item.id));
        this.serviceItems = items;
      }
    });
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }



  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];

}

export interface Section {
  name: string;
  updated: Date;
}
