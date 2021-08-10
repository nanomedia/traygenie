import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss']
})
export class PopupConfirmComponent implements OnInit {

  title: string;
  question: string;

  constructor(private dialogRef: MatDialogRef<PopupConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.title = data.title;
    this.question = data.question;
  }

  ngOnInit(): void {
  }

  confirm() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }

}
