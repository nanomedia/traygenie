import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { SGDService } from 'src/app/_services/sgd.service';
import { environment } from 'src/environments/environment';
import * as errors from '../../_shared/jsons/messages.json';

@Component({
  selector: 'app-error400',
  templateUrl: './error400.component.html',
  styleUrls: ['./error400.component.scss']
})
export class Error400Component implements OnInit {
  currentSession: IVerifyTokenModel | null;
  error: any | null;
  private errors: any[] | null;

  constructor(
    private _sgdService: SGDService,
    private _activatedRoute: ActivatedRoute) {
    this.errors = (errors as any).default;
    this.getCurrentSession();
  }


  private getCurrentSession() {
    this.currentSession = this._sgdService.getCurrentSession();
  }

  ngOnInit(): void {
    const codeError = this._activatedRoute.snapshot.paramMap.get('code') ?? null;
    this.error = this.errors.find(item => item.code === codeError);
  }
  cancel() {
    const url = this.currentSession?.cancelUri || environment.BASE_URL_DEFAULT_REDIRECT;
    location.href = url;
  }
  
  ngOnDestroy(): void {}

}
