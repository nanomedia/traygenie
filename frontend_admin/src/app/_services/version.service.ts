import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IVersionRequest, IVersionResponse } from '../_interfaces/version.interface';
import { IPagination } from '../_interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(private _httpClient: HttpClient) { }

  postAdminVersionInsert(request: IVersionRequest) {
    return this._httpClient.post<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/version-insert`, request);
  }

  putAdminVersionUpdate(request: IVersionRequest) {
    return this._httpClient.put<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/version-update`, request);
  }

  putAdminVersionChangeStatus(request: IVersionRequest) {
    return this._httpClient.put<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/version/change-status`, request);
  }

  getAdminVersion(serviceCode: string, filter: string, page: number = 1, count: number = 5) {
    const _filter = ![null, '', undefined].includes(filter?.trim()) ? `filter=${encodeURI(filter.trim())}` : 'filter';
    const _service_code = `service_code=${serviceCode}`;
    const _page = `page=${page}`;
    const _count = `count=${count}`;

    const _arrayParam = [_filter, _page, _count, _service_code];
    const params = _arrayParam.join('&');
    return this._httpClient.get<IPagination<IVersionResponse>>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/version?${params}`);
  }

  getAdminVersionOne(id: string) {
    return this._httpClient.get<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/version/one?id=${id}`);
  }

}
