import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { IAuthRequest } from './_interfaces/queryParam.interface';
import { environment } from '../environments/environment';
import { PathLocationStrategy } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend-base';
  private queryParams: IAuthRequest;

  constructor(
    private deviceService: DeviceDetectorService,
    private _titleService: Title,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private pathLocationStrategy: PathLocationStrategy
  ) {
    this._titleService.setTitle(environment.APP_TITLE);
    const basePath = pathLocationStrategy.getBaseHref();
    const absolutePathWithParams = pathLocationStrategy.path();
    if (basePath !== absolutePathWithParams) {
      _router.navigateByUrl(absolutePathWithParams);
    }

  }

  ngOnInit() {
    if (this.deviceService.isDesktop()) {
      this.getQueryParams();
    } else {
      this._router.navigate(['/error', 'restriccion_acr_device']);
    }
  }


  private getQueryParams() {
    const snapshot: RouterStateSnapshot = this._router.routerState.snapshot;
    debugger;
    if (snapshot.url != "" && snapshot.url != "/") {

      const _param = this._activatedRoute.snapshot.queryParams ?? null;
      if (_param) {
        this._router.navigate(['/inicio'], {
          state: _param
        });
      }
    }
    else if (snapshot.url == "/") {
      this._router.navigate(['/error', 'invalid_request']);
    }
  }
}
