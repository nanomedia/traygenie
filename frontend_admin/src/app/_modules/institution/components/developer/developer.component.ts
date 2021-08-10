import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { IPagination } from 'src/app/_interfaces/pagination.interface';
import { BusyService } from 'src/app/_services/busy.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { IResponse } from 'src/app/_interfaces/response.interface';
import { IDeveloperItem } from 'src/app/_interfaces/developer.interface';
import { DevelopersService } from 'src/app/_services/developers.service';
import { PopupTextValidateComponent } from 'src/app/_shared/components/popup-text-validate/popup-text-validate.component';
import { MessageService } from 'src/app/_shared/services/message.service';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss']
})
export class DeveloperComponent implements OnInit {

  displayedColumns = ['num', 'dni', 'nombre', 'apellidos', 'correo', 'celular', 'fecha', 'opciones'];
  showPage: boolean;

  private _unsubscribeAll: Subject<any>;
  dataSource: IPagination<IDeveloperItem>;
  page = 1;
  count = 5;
  formGroup: FormGroup | null;
  isLoading = false;
  constructor(
    private _messageService: MessageService,
    private _busyService: BusyService,
    private _developerService: DevelopersService,
    private _formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    this.createFormGroup();
    this.listenLoadingEvent();
    this.buscar();
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

  delete(item: IDeveloperItem) {
    const _nameArray = [item.names, item.lastname_1, item.lastname_2, item.lastname_3];
    const fullName = _nameArray.join(' ');

    const dialogRef = this.dialog.open(PopupTextValidateComponent, {
      data: {
        title: `Eliminar desarrollador`,
        question: `¿Estás seguro que deseas eliminar al desarrollador?`,
        confirmQuestion: `Para confirmar, ingresa el nombre del desarrollador`,
        field: `Nombre del desarrollador`,
        fieldData: fullName
      },
      width: '98%',
      maxWidth: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDev(item._id);
      }
    });
  }

  private async deleteDev(id: string) {
    const response = await this._developerService
      .deleteOrgDeveloperDelete(id)
      .toPromise();

    if (response?.success) {
      this.renderResponse(response, 'delete');
      this.getDataSource();
    } 
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

  edit(item: IDeveloperItem) {
    const _id = item._id;
    this.router.navigate(['/institution/developer/edit', _id]);
  }

  getRowNumber(index: number) {
    return this.page == 1 ? index + 1 : 1 + index + (this.page - 1) * this.count;
  }

  buscar() {
    this.page = 1;
    this.count = 5;
    this.getDataSource();
  }


  private createFormGroup() {
    this.formGroup = this._formBuilder.group({
      filter: [null]
    })
  }

  private getFilterValue(filterValue: string) {
    filterValue = filterValue?.trim();
    filterValue = filterValue?.toLowerCase();
    return filterValue;
  }


  private async getDataSource() {
    const _word = this.formGroup.get('filter').value;
    const word = this.getFilterValue(_word);

    const data = await this._developerService.getOrgDeveloper(word, this.page, this.count)
      .toPromise();
    this.showPage = true;
    this.dataSource = data;
  }


  get pageIndex() {
    return this.page < 0 ? 0 : (this.page - 1);
  }

  pageEvent(page: any) {
    this.page = page.pageIndex + 1;
    this.count = page.pageSize;
    this.getDataSource();
  }
}
