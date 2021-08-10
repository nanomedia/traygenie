import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IVerifyDocRequest, IVerifyTokenModel } from 'src/app/_interfaces/verify-token.interface';
import { SGDService } from 'src/app/_services/sgd.service';
import { Subject } from 'rxjs';
import { BusyService } from 'src/app/_services/busy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dni',
  templateUrl: './dni.component.html',
  styleUrls: ['./dni.component.scss']
})
export class DniComponent implements OnInit {

  isLoading = false;
  isPressed = false;

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

  async goToPasswordStep() {

    


  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }


  private createForm() {
    this.formGroup = this._formBuilder.group({
      'dni': [null, [Validators.required, Validators.minLength(8)]],
    });
  }
  isInValidField(strField: string): boolean {
    const field = this.formGroup.get(strField);
    return field.invalid && field.touched;
  }



}
