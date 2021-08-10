import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ApplicationService } from 'src/app/_services/application.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  private appId: string | null;
  private unsubscribeAll: Subject<any>;

  constructor(
    public appService: ApplicationService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
      this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getAppId();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  
  private async getAppId() {
    
    const appId = this.activatedRoute.snapshot.paramMap.get('id') ?? null;
    if (appId) {

      const id = this.appService.getAppCurrentSubjet().getValue();

      if (appId === id) {
        this.appId = id;
      }

      else {
       await this.setValidApplication(appId);
      }

    } else {
      this.router.navigate(["/login-redirect"]);
    }
  }


  private async setValidApplication(id: string) {
    this.appService.setServicesSource(null);
    let response = false;
    response = await forkJoin(
      [
        this.appService.getApplicationAppOne(id),
        this.appService.getApplicationOrganizationServices(id)
      ])
      .pipe(takeUntil(this.unsubscribeAll))
      .pipe(
        map(([appResponse, servicesResponse]) => {
          const appId: string = null;
          let response: boolean = false;

          if (appResponse?.success) {
            this.appId = appResponse.Item._id;
            this.appService.setAppCurrentId(this.appId);
            this.appService.setCurrentApp(appResponse.Item);
            response = true;
          } else {
            return false;
          }

          if (this.appId && servicesResponse?.success) {
            this.appService.setServicesSource(servicesResponse.service);
          }

          return response;
        })
      )
      .toPromise();

    if (!response) {
      this.router.navigate(["/login-redirect"]);
    }
  }

}
