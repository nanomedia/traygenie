import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationService } from 'src/app/_services/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BusyService } from 'src/app/_services/busy.service';
import { PopupTextValidateComponent } from 'src/app/_shared/components/popup-text-validate/popup-text-validate.component';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-avanzado',
  templateUrl: './avanzado.component.html',
  styleUrls: ['./avanzado.component.scss']
})
export class AvanzadoComponent extends BaseComponent implements OnInit {

  _appId: string | null;
  appName: string | null;
  isLoading = false;



  private _unsubscribeAll: Subject<any>;

  constructor(
    private _busyService: BusyService,
    private _messageService: MessageService,
    private dialog: MatDialog,
    public appService: ApplicationService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {

    super(appService, activatedRoute, router);
    this._unsubscribeAll = new Subject();
  }


  ngOnInit(): void {
    super.ngOnInit();
    this.listenLoadingEvent();
    this.getApplicationData();
    this.getAppName();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  async getApplicationData() {
    this.appService.getAppCurrentId()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(id => {
        this._appId = id ?? null;
      })

  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  private getAppName() {

    this.appService
      .getCurrentApp()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(app => {
        this.appName = app?.name;
      });
  }


  delete() {
    if (this._appId) {

      const dialogRef = this.dialog.open(PopupTextValidateComponent, {
        data: {
          title: `Eliminar la aplicación`,
          question: `¿Estás seguro que deseas eliminar la aplicación?`,
          confirmQuestion: `Para confirmar, ingresa el nombre de la aplicación`,
          field: `Nombre de la aplicación`,
          fieldData: this.appName
        },
        width: '98%',
        maxWidth: '450px'
      });


      dialogRef.afterClosed().subscribe(async result => {
        if (result) {

          const response = await this.appService
            .delApplicationAppDeleted(this._appId)
            .toPromise();

          if (response?.success) {
            this.appService.setCurrentApp(null); 
            this.appService.setAppCurrentId(null);
            this.appService.setServicesSource(null);
            this._messageService.showSuccessDelete();
            this.router.navigate(['/login-redirect']);
          }
          else if (response?.error) {
            const error = response?.error;
            this._messageService.showWarning(error.message);
          }
        }
      });

    }
  }
}
