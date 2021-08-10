import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IVerifyDocRequest, IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { SGDService } from 'src/app/_services/sgd.service';
import { Subject } from 'rxjs';
import { BusyService } from 'src/app/_services/busy.service';
import { takeUntil } from 'rxjs/operators';
import { RecaptchaComponent } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dni',
  templateUrl: './dni.component.html',
  styleUrls: ['./dni.component.scss']
})
export class DniComponent implements OnInit {


  @ViewChild('captchaRef')
  reCaptcha: RecaptchaComponent;

  isLoading = false;
  isPressed = false;
  error: any | null;

  private currentSession: IVerifyTokenModel | null;
  private _unsubscribeAll: Subject<any>;


  hide = true;
  formGroup: FormGroup | null;
  constructor(
    private _busyService: BusyService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private _sgdService: SGDService) {

    this._unsubscribeAll = new Subject();
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
    window.onbeforeunload = () => { }
    this.isPressed = true;
    let url = this._sgdService.cancelUri;
    this._sgdService.signOut();
    location.href = url;
    sessionStorage.clear();
  }

  private getCurrentSession() {
    this.currentSession = this._sgdService.getCurrentSession();
  }

  async goToPasswordStep() {
    this.error = null;

    if (this.formGroup.valid) {
      const doc = this.formGroup.controls['dni'].value;
      const reqId = this.currentSession?.reqId;
      const recaptcha = this.formGroup.controls['recaptcha']?.value ?? '';
      const request: IVerifyDocRequest = { reqId, doc, recaptcha };
      const response = await this._sgdService.postVerifyDoc(request).toPromise();

      if (response.success) {
        this.isPressed = true;
        this.formGroup.controls['dni'].setErrors(null);
        this.router.navigate(['/clave'], { state: { doc } });
      } else {
        this.error = response.error;
        this.processingRecaptcha();
      }
    }
  }

  private processingRecaptcha() {
    let dni_count = sessionStorage.getItem('dni_count') ?? 0;

    if (+dni_count < environment.MAX_TRIES_TO_RECAPTCHA) {
      dni_count = (+dni_count + 1).toString();
      sessionStorage.setItem('dni_count', dni_count);
    }
    if (+dni_count === environment.MAX_TRIES_TO_RECAPTCHA) {
      if (!this.isThereRecaptcha()) {
        this.formGroup.addControl('recaptcha', new FormControl(null, Validators.required))
      }
    }
  }

  isThereRecaptcha() {
    return this.formGroup.controls['recaptcha'] ? true : false;
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  private createForm() {
    this.formGroup = this._formBuilder.group({
      'dni': [null, [Validators.required, Validators.minLength(8)]]
    });
  }
}
