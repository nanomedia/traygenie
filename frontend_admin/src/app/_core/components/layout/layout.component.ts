import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit ,ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil,filter,withLatestFrom  } from 'rxjs/operators';
import { MenuNavigation, MenuItem } from './menu.data';

import { Router, NavigationEnd } from '@angular/router';
import { SecurityService } from 'src/app/_services/security.service';
import { BusyService } from 'src/app/_services/busy.service';
import {  MatSidenav} from '@angular/material/sidenav';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );



  public isHandset1$: Observable<boolean> = this.breakpointObserver1
    .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.WebLandscape])
    .pipe(map((result: BreakpointState) => result.matches));

  private _unsubscribeAll: Subject<any>;
  
  isLoading: boolean;

  dataNavigation: MenuItem[];

  constructor(
    private _busyService: BusyService,
    private _securityService: SecurityService,
    private _router: Router,
    private breakpointObserver: BreakpointObserver,
    private breakpointObserver1: BreakpointObserver,router: Router,
    
  ) {
    router.events.pipe(
      withLatestFrom(this.isHandset$),
      filter(([a, b]) => b && a instanceof NavigationEnd)
    ).subscribe(_ => this.drawer?.close());
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.listenLoadingEvent();
    this.loadMenuData();
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

  private loadMenuData() {
    const instData = MenuNavigation.filter(item => !item.id.includes('admin'));
    const adminData = MenuNavigation.filter(item => item.id.includes('admin'));

    this._securityService.currentUser$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(u => {
        switch (u.perfil) {
          case "INSTITUTION-USER":
            this.dataNavigation = [...instData];
            this._router.navigate(['main/datos-generales']);
            break;
          case "ADMIN":
            this.dataNavigation = [...adminData];
            this._router.navigate(['main/instituciones']);
            break;
          default:
            this.dataNavigation = [];
            break
        }
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
