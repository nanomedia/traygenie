import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IVerifyPasswordRequest, IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { BusyService } from 'src/app/_services/busy.service';
import { SGDService } from 'src/app/_services/sgd.service';
@Component({
  selector: 'app-clave-nacional',
  templateUrl: './clave-nacional.component.html',
  styleUrls: ['./clave-nacional.component.scss']
})
export class ClaveNacionalComponent implements OnInit {

  isLoading = false;

  private doc: string | null;
  currentSession: IVerifyTokenModel | null;


  private _unsubscribeAll: Subject<any>;

  formGroup: FormGroup | null;
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
   
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  cancel() {
   
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
    
  }

}
