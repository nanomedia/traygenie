import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { BusyService } from 'src/app/_services/busy.service';
import { takeUntil } from 'rxjs/operators';
import { InstitutionService } from 'src/app/_services/institution.service';

@Component({
  selector: 'app-datosgenerales',
  templateUrl: './datosgenerales.component.html',
  styleUrls: ['./datosgenerales.component.scss']
})
export class DatosgeneralesComponent implements OnInit {


  formGroup: FormGroup | null;
  isLoading: boolean;
  showPage: boolean;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _busyService: BusyService,
    private formBuilder: FormBuilder,
    private _institutionService: InstitutionService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.createForm();
    this.listenLoadingEvent();
    this.getInstitution();
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

  private createForm() {
    this.formGroup = this.formBuilder.group({
      code: [null],
      name: [null],
      countApp: [null],
      countDev: [null]
    });

    this.formGroup.controls['code'].disable();
    this.formGroup.controls['name'].disable();
    this.formGroup.controls['countApp'].disable();
    this.formGroup.controls['countDev'].disable();
  }

  private async getInstitution() {
    const response = await this._institutionService.getOrganizationInfo().toPromise();

    if (response.success) {
      const org = response?.data?.organization;
      this.formGroup.get('code').setValue(org.code);
      this.formGroup.get('name').setValue(org.name);
      this.formGroup.get('countApp').setValue(response.data.countApp);
      this.formGroup.get('countDev').setValue(response.data.countDev);
    }

    this.showPage = true;
  }



}
