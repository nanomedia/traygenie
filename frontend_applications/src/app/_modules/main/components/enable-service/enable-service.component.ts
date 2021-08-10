import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IServiceEnabledRequest } from 'src/app/_interfaces/service.interface';
import { BusyService } from 'src/app/_services/busy.service';
import { ServiceService } from 'src/app/_services/service.service';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-enable-service',
  templateUrl: './enable-service.component.html',
  styleUrls: ['./enable-service.component.scss']
})
export class EnableServiceComponent implements OnInit {


  @Input()
  appId: string | null;

  @Input()
  serviceName: string | null;

  @Output()
  enableEvent: EventEmitter<boolean> | null;

  isLoading: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _busyService: BusyService,
    private _messageService: MessageService,
    private _srvService: ServiceService) {

    this.enableEvent = new EventEmitter<boolean>();
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

  enableApp() {
    this.enableService();
  }

  private async enableService() {
    if (this.appId && this.serviceName) {
      const request: IServiceEnabledRequest = { id: this.appId, service_code: this.serviceName };
      const response = await this._srvService.postApplicationServiceEnabled(request).toPromise();
      if (response?.success) {
        this.enableEvent.emit(true);
        this._messageService.showSuccess('Se habilitó correctamente.');
      }
      else if (response?.error) {
        const error = response?.error;
        this._messageService.showWarning(error.message);
      }
    }
  }
}
