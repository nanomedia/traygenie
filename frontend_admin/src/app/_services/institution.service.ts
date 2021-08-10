import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IOrganizationApplication } from '../_interfaces/institution.interface';
import { IResponse } from '../_interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  constructor(private _httpClient:HttpClient) { }

  getOrganizationInfo() {
    return this._httpClient.get<IResponse<IOrganizationApplication>>(`${environment.BASE_URL_SERVICE_ADMIN}/organization/info`);
  }
}
