import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-popup-text-validate',
  templateUrl: './popup-text-validate.component.html',
  styleUrls: ['./popup-text-validate.component.scss']
})
export class PopupTextValidateComponent implements OnInit {
  title:string;
  question:string;
  confirmQuestion:string;
  field:string;
  fieldData:string;
  
  formGroup: FormGroup;
  disabled: boolean = true;

  private _unsubscribeAll: Subject<any>;
  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PopupTextValidateComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this._unsubscribeAll = new Subject();

    this.title = data.title;
    this.question = data.question;
    this.confirmQuestion = data.confirmQuestion;
    this.field = data.field;
    this.fieldData = data?.fieldData?.trim();
  }

  ngOnInit(): void {
    this.createForm();
  }

  confirm() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }

  private createForm() {
    this.formGroup = this._formBuilder.group({
      fieldData: [null, [Validators.required]]
    });
    this.onChanges();
  }

  private onChanges(): void {
    this.formGroup.get('fieldData').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((val: string) => {
      val = val ?? '';
      this.disabled = !(val === this.fieldData);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  isInValidField(strField: string): boolean {
    const field = this.formGroup.get(strField);
    return field.invalid && field.touched;
  }



}
