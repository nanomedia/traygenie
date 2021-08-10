import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServiceMenuNavigation } from 'src/app/_core/components/layout/menu.data';
import { BusyService } from 'src/app/_services/busy.service';
import { PopupTextValidateComponent } from 'src/app/_shared/components/popup-text-validate/popup-text-validate.component';
import { ServiceService } from '../../../../_services/service.service';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-disable-service',
  templateUrl: './disable-service.component.html',
  styleUrls: ['./disable-service.component.scss']
})
export class DisableServiceComponent implements OnInit {

  @Input()
  serviceId: string | null;

  @Input()
  serviceName: string | null;

  @Output()
  disableEvent: EventEmitter<boolean> | null;

  private serviceDescription: string | null;
  isLoading: boolean;


  private _unsubscribeAll: Subject<any>;

  constructor(
    private router:Router,
    private _busyService: BusyService,
    private _messageService: MessageService,
    private dialog: MatDialog,
    private _srvService: ServiceService) {
      
    this.disableEvent = new EventEmitter<any>();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getServiceDescription();
    this.listenLoadingEvent();
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  private getServiceDescription() {
    if (this.serviceName) {
      const menuItem = ServiceMenuNavigation.find(item => item.id == this.serviceName)
      this.serviceDescription = menuItem.title;
    }
  }

  disableApp() {
    if (this.serviceId) {

      const dialogRef = this.dialog.open(PopupTextValidateComponent, {
        data: {
          title: `Deshabilitar el servicio`,
          question: `¿Estás seguro que deseas deshabilitar el servicio?`,
          confirmQuestion: `Para confirmar, ingresa el nombre del servicio`,
          field: `Nombre del servicio`,
          fieldData: this.serviceDescription
        },
        width: '98%',
        maxWidth: '450px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.disableService();         
        }
      });

    }
  }

  private async disableService() {
    const response = await this._srvService
      .putApplicationServiceDisabled(this.serviceId)
      .toPromise();

    if (response.success) {
      this.disableEvent.emit(true);
      this._messageService.showSuccess('Se deshabilitó correctamente.');
    }
    
    else if (response?.error) {
      const error = response?.error;
      this._messageService.showWarning(error.message);
    }
  }
}
