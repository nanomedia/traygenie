import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IResponse } from '../_interfaces/response.interface';
import { IOrgInfoAppRequest } from '../_interfaces/institution.interface';
import { IServiceItem } from '../_interfaces/service.interface';
import { IPagination } from '../_interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class OrgInfoAppService {

  constructor(private _httpClient: HttpClient) { }


  getApplicacionInfo(id: string) {
    return this._httpClient.get<IResponse<IOrgInfoAppRequest>>(`${environment.BASE_URL_SERVICE_ADMIN}/organization/info-app?id=${id}`);
  }

  putOrgServiceChangeStatus(id: string, value: boolean) {
    return this._httpClient.put<IResponse<any>>(`${environment.BASE_URL_SERVICE_ADMIN}/organization/service/change-status`, { id, value });
  }

  putOrgAppChangeProtected(id: string, value: boolean) {
    return this._httpClient.put<IResponse<any>>(`${environment.BASE_URL_SERVICE_ADMIN}/organization/app/change-protected`, { id, value });
  }

  putOrgAppChangeStatus(id: string, value: boolean) {
    return this._httpClient.put<IResponse<any>>(`${environment.BASE_URL_SERVICE_ADMIN}/organization/app/change-status`, { id, value });
  }

  deleteOrgAppDelete(id: string) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id }
    };

    return this._httpClient.delete<IResponse<any>>
      (`${environment.BASE_URL_SERVICE_ADMIN}/organization/app/deleted`, httpOptions);
  }

  getOrganizationApp(word?: string, page: number = 1, count: number = 5) {
    const _word = ![null, '', undefined].includes(word?.trim()) ? `name=${encodeURI(word.trim())}` : 'word';
    const _page = `page=${page}`;
    const _count = `count=${count}`;

    const _arrayParam = [_word, _page, _count];
    const params = _arrayParam.join('&');
    return this._httpClient.get<IPagination<IServiceItem>>(`${environment.BASE_URL_SERVICE_ADMIN}/organization/app?${params}`);
    // return this._httpClient.get<IPagination<IServiceItem>>(`${environment.BASE_URL_SERVICE_ADMIN}/application/app?${params}`);
  }

}
