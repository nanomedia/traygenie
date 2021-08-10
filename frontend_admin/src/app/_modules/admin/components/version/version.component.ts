import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})

export class VersionComponent implements OnInit {
  formGroup: FormGroup | null;
  metodo: string | null;
  private version_number: string | null;

  constructor(private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<VersionComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.version_number = data?.version_number ?? null;
    this.metodo = data?.metodo ?? null;
  }

  ngOnInit(): void {
    this.createForm();
  }

  isInValidField(strField: string): boolean {
    const field = this.formGroup.get(strField);
    return field.invalid && field.touched;
  }

  save() {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }

  close() {
    this.dialogRef.close();
  }

  createForm() {
    this.formGroup = this._formBuilder.group({
      version_number: [this.version_number, [Validators.required, Validators.maxLength(20)]]
    })
  }

}
