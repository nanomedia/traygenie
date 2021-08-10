import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IVerifyPasswordRequest, IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { BusyService } from 'src/app/_services/busy.service';
import { SGDService } from 'src/app/_services/sgd.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clave-nacional',
  templateUrl: './clave-nacional.component.html',
  styleUrls: ['./clave-nacional.component.scss']
})
export class ClaveNacionalComponent implements OnInit {

  @ViewChild('captchaRef')
  reCaptcha: RecaptchaComponent;

  isLoading = false;
  currentSession: IVerifyTokenModel | null;
  formGroup: FormGroup | null;
  error: any | null;
  isPressed = false;

  private doc: string | null;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _sgdService: SGDService,
    private _busyService: BusyService,
    private sgdService: SGDService,
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {

    this._unsubscribeAll = new Subject();
    this.getMainValues();
  }

  ngOnInit(): void {
    this.createForm();
    this.listenLoadingEvent();
    this.getCurrentSession();
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  cancel() {
    this.isPressed = true;
    window.onbeforeunload = () => { }
    let url = this._sgdService.cancelUri;
    this._sgdService.signOut();
    location.href = url;
    sessionStorage.clear();
  }

  private getCurrentSession() {
    this.currentSession = this._sgdService.getCurrentSession();
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  async processNextStep() {
    this.error = null;

    if (this.formGroup.valid) {
      const password = this.formGroup.controls['password'].value;
      const reqId = this.currentSession?.reqId;
      const doc = this.doc;
      const recaptcha = this.formGroup.controls['recaptcha']?.value ?? '';
      const request: IVerifyPasswordRequest = { reqId, doc, password, recaptcha };
      const response = await this.sgdService.postVerifyPassword(request).toPromise();

      if (response?.success) {
        this.isPressed = true;
        window.onbeforeunload = () => { }
        let _url: string = response.coreRedirect;
        location.href = _url;
      } else {
        this.error = response.error;
        this.processingRecaptcha();
      }
    }
  }
  private processingRecaptcha() {
    let clave_count = sessionStorage.getItem('clave_count') ?? 0;

    if (+clave_count < environment.MAX_TRIES_TO_RECAPTCHA) {
      clave_count = (+clave_count + 1).toString();
      sessionStorage.setItem('clave_count', clave_count);
    }
    if (+clave_count === environment.MAX_TRIES_TO_RECAPTCHA) {
      if (!this.isThereRecaptcha()) {
        this.formGroup.addControl('recaptcha', new FormControl(null, Validators.required))
      }
    }
  }

  isThereRecaptcha() {
    return this.formGroup.controls['recaptcha'] ? true : false;
  }

  private createForm() {
    this.formGroup = this._formBuilder.group({
      'password': [null, [Validators.required]],
    });
  }

  isInValidField(strField: string): boolean {
    const field = this.formGroup.get(strField);
    return field.invalid && field.touched;
  }


  getMainValues() {
    this.activatedRoute.params
      .pipe(map(() => window.history.state))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.doc = params['doc'] ?? null;
      });
  }

}
