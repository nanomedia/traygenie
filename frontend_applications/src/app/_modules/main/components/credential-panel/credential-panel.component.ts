import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs, FileSaverOptions } from 'file-saver';
import { Subject } from 'rxjs';
import { IServiceOneResponse } from 'src/app/_interfaces/service.interface';
import { ServiceService } from '../../../../_services/service.service';
import { BusyService } from '../../../../_services/busy.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from '../../../../_shared/services/message.service';

@Component({
  selector: 'app-credential-panel',
  templateUrl: './credential-panel.component.html',
  styleUrls: ['./credential-panel.component.scss']
})
export class CredentialPanelComponent implements OnInit {

  @Input()
  currentService: IServiceOneResponse | null;
  credentialForm: FormGroup | null;
  isLoading: boolean;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private router:Router,
    private _messageService:MessageService,
    private _busyService: BusyService,
    private _srvService: ServiceService,
    private _formBuilder: FormBuilder) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.createForms();
    this.listenLoadingEvent();
    this.setFormConfigData();
  }

  private listenLoadingEvent() {
    this._busyService.loading.pipe(takeUntil(this._unsubscribeAll)).subscribe(x => {
      this.isLoading = x;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.currentService.firstChange) {
      this.setFormConfigData();
    }
  }

  createForms() {
    this.credentialForm = this._formBuilder.group({
      client_id: this._formBuilder.control({ value: null, disabled: true }),
      client_secret: this._formBuilder.control({ value: null, disabled: true })
    });
  }

  private setFormConfigData() {

    if (this.currentService) {
      this.credentialForm.patchValue(this.currentService);
    }
  }

  async generateDownloadJsonUri() {
    if (this.currentService) {
      const response = await this._srvService
        .postApplicationServiceDownload(this.currentService._id)
        .toPromise();
      if (response.success) {
        const theJSON = JSON.stringify(response.data);
        const blob = new Blob([theJSON], { type: 'text/json' });
        const options: FileSaverOptions = {
          autoBom: false
        };
        saveAs(blob, 'idgobpe_config.json', options);
      }
     
      else if (response?.error) {
        const error = response?.error;
        this._messageService.showWarning(error.message);
      }
    }
  }

}
