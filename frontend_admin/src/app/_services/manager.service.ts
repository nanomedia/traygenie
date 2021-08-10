import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IManagerInsertRequest, IManagerItem, IManagerUpdateRequest } from '../_interfaces/manager.interface';
import { IPagination } from '../_interfaces/pagination.interface';
import { IResponse } from '../_interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private _httpClient: HttpClient) { }

  getAdminOrganization(organization_code: string, word?: string, page: number = 1, count: number = 5) {
    const _word = ![null, '', undefined].includes(word?.trim()) ? `word=${encodeURI(word?.trim())}` : 'word';
    const _orgCode = `organization_code=${organization_code}`;
    const _page = `page=${page}`;
    const _count = `count=${count}`;

    const _arrayParam = [_orgCode, _word, _page, _count];
    const params = _arrayParam.join('&');
    return this._httpClient.get<IPagination<IManagerItem>>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/manager?${params}`);
  }

  getAdminManagerSearch(doc: string) {
    const _doc = `doc=${doc}`;
    return this._httpClient.get<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/manager-search?${_doc}`);
  }

  postAdminManagerInsert(manager: IManagerInsertRequest) {
    return this._httpClient.post<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/manager-insert`, manager);
  }

  putAdminManagerUpdate(manager: IManagerUpdateRequest) {
    return this._httpClient.put<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/manager-update`, manager);
  }

  delAdminManagerDelete(id: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id }
    };

    return this._httpClient.delete<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/manager-delete`, httpOptions);
  }

  getAdminManagerOne(id: string) {
    const _id = `id=${id}`;
    return this._httpClient.get<IResponse<IManagerItem>>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/manager/one?${_id}`);
  }
}
