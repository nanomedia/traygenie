import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from 'src/app/_services/busy.service';
import { RegexPatterns } from 'src/app/_shared/regexPatterns';
import { IDeveloperOne, IDeveloperUpdateRequest } from 'src/app/_interfaces/developer.interface';
import { DevelopersService } from 'src/app/_services/developers.service';
import { MessageService } from 'src/app/_shared/services/message.service';

@Component({
  selector: 'app-edit-developer',
  templateUrl: './edit-developer.component.html',
  styleUrls: ['./edit-developer.component.scss']
})
export class EditDeveloperComponent implements OnInit {

  formGroup: FormGroup | null;
  isLoading = false;
  showPage: boolean;
  isSaving = false;


  private developerItem: IDeveloperOne | null;
  private developerId: string | null;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _messageService: MessageService,
    private _developerService: DevelopersService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private _busyService: BusyService,
  ) {
    this._unsubscribeAll = new Subject();
    this.getDeveloperId();
  }

  ngOnInit(): void {
    this.createForm();
    this.listenLoadingEvent();

    this.getDeveloper();
  }

  isInValidField(strField: string): boolean {
    const field = this.formGroup.get(strField);
    return field.invalid && field.touched;
  }


  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }


  private createForm() {
    this.formGroup = this._formBuilder.group({
      doc: [null],
      names: [null],
      lastName: [null],
      phone: [null, [Validators.required, Validators.pattern(RegexPatterns.CELULAR)]],
      email: [null, [Validators.required, Validators.pattern(RegexPatterns.EMAIL)]],
      position: [null, [Validators.required, Validators.maxLength(200)]],
    });

    this.formGroup.controls['doc'].disable();
    this.formGroup.controls['names'].disable();
    this.formGroup.controls['lastName'].disable();
  }

  private getDeveloperId() {
    this.developerId = this.activatedRoute.snapshot.paramMap.get('id') ?? null;
  }

  private async getDeveloper() {
    const _id = this.developerId;
    if (!_id) {
      this.router.navigate(['/institution/developer']);
      return false;
    }
    const response = await this._developerService.getOrgDeveloperOne(_id).toPromise();
    this.showPage = true;
    if (response.success) {
      this.developerItem = response.Item;
      const _lastName = `${this.developerItem.lastname_1} ${this.developerItem.lastname_2} ${this.developerItem.lastname_3}`;

      this.formGroup.get('doc').setValue(this.developerItem.doc);
      this.formGroup.get('names').setValue(this.developerItem.names);
      this.formGroup.get('lastName').setValue(_lastName);
      this.formGroup.get('phone').setValue(this.developerItem.phone);
      this.formGroup.get('email').setValue(this.developerItem.email);
      this.formGroup.get('position').setValue(this.developerItem.position);
    } else {
      this.router.navigate(['/institution/developer']);
    }
  }


  cancel() {
    this.router.navigate(['/institution/developer']);
  }

  save() {
    this.update();
  }

  private async update() {
    if (this.developerItem) {

      const request: IDeveloperUpdateRequest = {
        id: this.developerId,
        email: this.formGroup.value.email,
        phone: this.formGroup.value.phone,
        position: this.formGroup.value.position
      }

      this.isSaving = true;
      const _response = await this._developerService.putOrgDeveloperUpdate(request).toPromise();
      if (_response.success) {
        this.isSaving = false;
        this._messageService.showSuccessRegister();
        this.cancel();
      } else if (_response?.error) {
        this._messageService.showWarning(_response?.error.message);
      }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
