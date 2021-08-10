import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsuarioModel } from 'src/app/_models/usuario.model';
import { BusyService } from 'src/app/_services/busy.service';
import { SecurityService } from 'src/app/_services/security.service';
import { ApplicationService } from '../../../../_services/application.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAppOrganization } from '../../../../_interfaces/application.interface';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { RegexPatterns } from 'src/app/_shared/regexPatterns';
import { IApplicationModel } from '../../../../_models/application.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from '../../../../_shared/services/message.service';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-new-app',
  templateUrl: './new-app.component.html',
  styleUrls: ['./new-app.component.scss']
})
export class NewAppComponent implements OnInit {

  formGroup: FormGroup | null;
  isLoading = false;
  entities: IAppOrganization[] | null;


  file: File | null;
  url: string | ArrayBuffer | null;

  private user: UsuarioModel | null;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _messageService: MessageService,
    private formBuilder: FormBuilder,
    private _securityService: SecurityService,
    private _applicationService: ApplicationService,
    private _busyService: BusyService,
    private router: Router) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.createForm();
    this.listenLoadingEvent();
    this.getUser();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  createForm() {

    this.formGroup = this.formBuilder.group({
      name: [null, [Validators.required,Validators.maxLength(50)]],
      description: [null, [Validators.required,Validators.maxLength(150)]],
      url: [null, [Validators.required, Validators.pattern(RegexPatterns.URL)]],
      organization_code: [null, [Validators.required]],
      logo: [null]
    });
  }

  async save() {
    if (this.formGroup.valid) {

      let { name, description, url, organization_code } = this.formGroup.value;
      name = Base64.encode(name);
      description = Base64.encode(description);
      const request: IApplicationModel = { name, description, url, organization_code, logo: this.file };
      const response = await this._applicationService.postApplicationAppInsert(request).toPromise();

      if (response?.success) {
        this._messageService.showSuccessRegister();
        this.router.navigate(['/lista']);

      } else if (response?.error) {
        const error = response?.error;
        this._messageService.showWarning(error.message);
      }


    }
  }

  deleteImg() {
    this.file = null;
    this.url = null;
    this.formGroup.controls['logo'].setValue(this.url);
  }

  isInValidField(strField: string): boolean {
    const field = this.formGroup.get(strField);
    return field.invalid && field.touched;
  }


  public dropped(files: NgxFileDropEntry[]) {
    const _tempFile = files[0];
    if (_tempFile.fileEntry.isFile) {
      const fileEntry = _tempFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        const mimeType = file.type;
        if (mimeType.match(/image\/*/) !== null) {
          this.file = file;
          const reader = new FileReader();
          reader.readAsDataURL(this.file);
          reader.onload = (_event) => {
            this.url = reader.result;
            this.formGroup.controls['logo'].setValue(this.url);
          }

        }
      })
    }
  }

  public fileOver(event) {

  }

  public fileLeave(event) {
  }


  private listenLoadingEvent() {

    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  private getUser() {
    this._securityService.currentUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.user = x;
      const serviceParam = this.user.extra?.developer?.join(',');
      if (serviceParam) {
        this.getOrganizations(serviceParam);
      }
    });
  }

  private async getOrganizations(code: string) {
    const response = await this._applicationService.getApplicationOrganizationCode(code).toPromise();
    if (response?.success) {
      this.entities = response?.Items;
      
      if (this.entities.length === 1) {
        this.formGroup.controls['organization_code'].setValue(this.entities[0].code);
      }
    }
  }
}
