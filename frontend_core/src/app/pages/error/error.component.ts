import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDGobPeConst } from 'src/app/_shared/constants';
import { environment } from 'src/environments/environment';
import * as errors from '../../_shared/jsons/messages.json';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  error: any | null;
  private errors: any[] | null;

  constructor(
    private _activatedRoute: ActivatedRoute) {
    this.errors = (errors as any).default;
  }

  ngOnInit(): void {
    const codeError = this._activatedRoute.snapshot.paramMap.get('code') ?? null;
    this.error = this.errors.find(item => item.code === codeError);
  }

  cancel() {

    if (window.opener && window.opener !== window) {
      window.onbeforeunload = () => {
        window.opener.postMessage({ event: IDGobPeConst.EVENT_CANCEL }, '*');
      }
      window.close();
    }
    else {
      const url = environment.BASE_URL_DEFAULT_REDIRECT;
      location.href = url;
    }

  }

  ngOnDestroy(): void { }

}
