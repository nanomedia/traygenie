import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { OrgInfoAppService } from 'src/app/_services/org-info-app.service';
import { IService } from 'src/app/_interfaces/institution.interface';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BusyService } from 'src/app/_services/busy.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IApplicationItem } from 'src/app/_interfaces/application.interface';
import { IServiceModel } from 'src/app/_interfaces/service.interface';
import { OrganizationService } from 'src/app/_services/organization.service';
import { IResponse } from 'src/app/_interfaces/response.interface';
import { PopupConfirmComponent } from 'src/app/_shared/components/popup-confirm/popup-confirm.component';
import { PopupTextValidateComponent } from 'src/app/_shared/components/popup-text-validate/popup-text-validate.component';
import { MessageService } from '../../../../_shared/services/message.service';
import { ImageService } from 'src/app/_shared/services/image.service';

@Component({
  selector: 'app-editar-app',
  templateUrl: './editar-app.component.html',
  styleUrls: ['./editar-app.component.scss']
})
export class EditarAppComponent implements OnInit {

  isLoading: boolean;
  isServiceLoading: boolean;
  isAppLoading: boolean;
  showPage: boolean;

  enabledButtonText: string | null;

  private ApplicationId: string | null;
  private ApplicationItem: IApplicationItem | null;
  ServiceList: IServiceModel[] | null;

  imageToShow: any;

  formGroup: FormGroup;
  private _unsubscribeAll: Subject<any>;


  @ViewChild(MatTable) _matTable: MatTable<any>;

  displayedColumns = ['id', 'servicio', 'habilitado'];

  constructor(
    private _imageService: ImageService,
    private _busyService: BusyService,
    private _messageService: MessageService,
    private _organizationService: OrganizationService,
    private _orgInfoAppService: OrgInfoAppService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) {


    this._unsubscribeAll = new Subject();


    this.getApplicationId();
  }


  ngOnInit(): void {
    this.listenLoadingEvent();
    this.createForm();
    this.getApplication();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  changeEditable(event: MatSlideToggleChange) {
    this.changeEditableState(event);
  }

  changeEnabled() {
    this.changeStates('enabled');
  }
  delete() {
    this.changeStates('delete');
  }

  private async changeEditableState(event: MatSlideToggleChange) {
    const newValue = event.checked;
    const word = newValue ? "Proteger" : "Desproteger";

    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      data: {
        title: `${word} Aplicación`,
        question: `¿Estás seguro que deseas ${word.toLowerCase()} la aplicación?`
      },
      width: '98%',
      maxWidth: '450px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {

        const response = await this._orgInfoAppService
          .putOrgAppChangeProtected(this.ApplicationId, newValue)
          .toPromise();

        this.renderResponse(response);
      } else {
        this.formGroup.controls['editable'].setValue(!newValue);
      }
    });
  }

  private renderResponse(response: IResponse<any>, method?: string) {

    const delMessage = "Registro eliminado con éxito.";
    const successMessage = "Registro guardado con éxito.";

    let message = method === 'delete' ? delMessage : successMessage;

    if (response?.success) {
      this._messageService.showSuccess(message);
    }
    else if (response?.error) {
      this._messageService.showWarning(response?.error.message);
    }
  }


  changeStates(method) {
    let word = "Eliminar";

    if (method === "enabled") {
      word = this.ApplicationItem.enabled ? "Deshabilitar" : "Habilitar";
    }

    const item = this.ApplicationItem;
    const dialogRef = this.dialog.open(PopupTextValidateComponent, {
      data: {
        title: `${word} la aplicación`,
        question: `¿Estás seguro que deseas ${word.toLowerCase()} la aplicación?`,
        confirmQuestion: `Para confirmar, ingresa el nombre de la aplicación`,
        field: `Nombre de la aplicación`,
        fieldData: item.name
      },
      width: '98%',
      maxWidth: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeAppstates(method);
      }
    });
  }


  private async changeAppstates(method: string) {
    let _service = new Observable<IResponse<null>>();

    if (method === "enabled") {
      _service = this._orgInfoAppService.putOrgAppChangeStatus(this.ApplicationId, !this.ApplicationItem.enabled);
    }
    else if (method === "delete") {
      _service = this._orgInfoAppService.deleteOrgAppDelete(this.ApplicationId);
    }

    const response = await _service.toPromise();

    if (response?.success) {
      this.renderResponse(response, method);
      this.router.navigate(['institution/apps']);
    }
  }

  private createForm() {
    this.formGroup = this._formBuilder.group({
      organization_code: [null],
      client_id: [],
      name: [null],
      description: [null],
      url: [null],
      logo_url: [null],
      editable: [null],
      enabled: [null]
    });

    this.formGroup.controls['organization_code'].disable();
    this.formGroup.controls['client_id'].disable();
    this.formGroup.controls['name'].disable();
    this.formGroup.controls['description'].disable();
    this.formGroup.controls['url'].disable();
    this.formGroup.controls['logo_url'].disable();
  }

  private async getApplication() {
    if (!this.ApplicationId) {
      this.router.navigate(['/institution/apps']);
    } else {
      this.isAppLoading = true;
      this.isServiceLoading = true;
      const response = await this._orgInfoAppService.getApplicacionInfo(this.ApplicationId).toPromise();
      this.isAppLoading = false;

      if (response.success) {
        if (response.data.app) {
          this.ApplicationItem = response.data.app;
          this.enabledButtonText = this.ApplicationItem.enabled ? "DESHABILITAR" : "HABILITAR";
          this.getImageFromService(this.ApplicationItem?.logo_url);
        }

        if (response.data.services) {
          const _services = response.data.services;
          this.getServicesList(_services);
        } else {
          this.isServiceLoading = false;
        }
        this.setApplicationItem()

      }
    }
  }

  private async getImageFromService(url: string) {
    if (!url) { return false; }
    let file: Blob | null;

    try { file = await this._imageService.getImage(url).toPromise(); }
    catch (error) {
      // throw Error('Error al procesar la imagen.');
     }

    if (file) {
      this.createImageFromBlob(file);
    }
  }

  private setApplicationItem() {
    if (this.ApplicationItem) {
      const item = this.ApplicationItem;
      this.formGroup.get('organization_code').setValue(item.organization_code);
      this.formGroup.get('client_id').setValue(item.client_id);
      this.formGroup.get('name').setValue(item.name);
      this.formGroup.get('description').setValue(item.description);
      this.formGroup.get('url').setValue(item.url);
      this.formGroup.get('logo_url').setValue(item.logo_url);
      this.formGroup.get('editable').setValue(item.editable);
      this.formGroup.get('enabled').setValue(item.enabled);

    }
  }

  private getApplicationId() {
    this.ApplicationId = this.activatedRoute.snapshot.paramMap.get('id') ?? null;
  }


  async toggleChange(event: MatSlideToggleChange, row: IServiceModel) {
    event.source.checked = await this.changeStatus(event.checked, row.id);
  }

  private async changeStatus(enabled: boolean, id: string): Promise<boolean> {

    const response = await this._orgInfoAppService.putOrgServiceChangeStatus(id, enabled).toPromise();

    if (response?.success) {
      this.renderResponse(response);
      return enabled;
    }
    return !enabled;
  }

  async getServicesList(services: IService[]) {
    this.isServiceLoading = true;
    const response = await this._organizationService.getAdminCatalogAdmin('services');
    const _catalogServiceData = response.filter(item => item.category === 'services');
    this.showPage = true;

    this.ServiceList = services.map((service, index) => {
      const item = _catalogServiceData.find(catalog => catalog.code === service.service_code);
      const model: IServiceModel = {
        num: (index + 1),
        id: service._id,
        code: service.service_code,
        value: item.value,
        enabled: service.enabled,
      }
      return model;
    });

    this.isServiceLoading = false;
  }

}






