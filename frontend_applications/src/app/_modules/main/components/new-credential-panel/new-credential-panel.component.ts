import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from 'src/app/_services/busy.service';
import { ServiceService } from 'src/app/_services/service.service';
import { PopupConfirmComponent } from 'src/app/_shared/components/popup-confirm/popup-confirm.component';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-new-credential-panel',
  templateUrl: './new-credential-panel.component.html',
  styleUrls: ['./new-credential-panel.component.scss']
})
export class NewCredentialPanelComponent implements OnInit {

  @Input()
  serviceId: string | null;

  @Output()
  newCredentialEvent: EventEmitter<boolean> | null;

  isLoading: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private router:Router,
    private _busyService: BusyService,
    private _messageService: MessageService,
    private dialog: MatDialog,
    private _srvService: ServiceService) {
    this.newCredentialEvent = new EventEmitter<boolean>();

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.listenLoadingEvent();
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  async regenerate() {

    if (this.serviceId) {

      const dialogRef = this.dialog.open(PopupConfirmComponent, {
        data: {
          title: `Generar credenciales`,
          question: `¿Estás seguro de generar las credenciales?`
        },
        width: '98%',
        maxWidth: '450px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.generateCredential();
        }
      });
    }
  }

  private async generateCredential() {
    const response = await this._srvService
      .postApplicationServiceRegenerate(this.serviceId)
      .toPromise();
    this.newCredentialEvent.emit(true);
    if (response.success) {
      this._messageService.showSuccess('Se generó credenciales correctamente.');
    }
   
    else if (response?.error) {
      const error = response?.error;
      this._messageService.showWarning(error.message);
    }
  }

}

