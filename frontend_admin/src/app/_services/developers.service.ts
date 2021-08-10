import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IPagination } from '../_interfaces/pagination.interface';
import { IResponse } from '../_interfaces/response.interface';
import { IDeveloperInsertRequest, IDeveloperUpdateRequest, IDeveloperItem, IDeveloperOne } from '../_interfaces/developer.interface';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService {

  constructor(private httpClient: HttpClient) { }

  postOrgDeveloperInsert(request: IDeveloperInsertRequest) {
    return this.httpClient.post<IResponse<any>>
      (`${environment.BASE_URL_SERVICE_ADMIN}/organization/developer-insert`, request);
  }

  putOrgDeveloperUpdate(request: IDeveloperUpdateRequest) {
    return this.httpClient.put<IResponse<any>>
      (`${environment.BASE_URL_SERVICE_ADMIN}/organization/developer-update`, request);
  }

  deleteOrgDeveloperDelete(id: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id }
    };

    return this.httpClient.delete<IResponse<any>>
      (`${environment.BASE_URL_SERVICE_ADMIN}/organization/developer-delete`, httpOptions);
  }

  getOrgDeveloper(word?: string, page: number = 1, count: number = 5) {
    const _word = ![null, '', undefined].includes(word?.trim()) ? `word=${encodeURI(word.trim())}` : 'word';
    const _page = `page=${page}`;
    const _count = `count=${count}`;

    const _arrayParam = [_word, _page, _count];
    const params = _arrayParam.join('&');
    return this.httpClient.get<IPagination<IDeveloperItem>>(`${environment.BASE_URL_SERVICE_ADMIN}/organization/developer?${params}`);
  }

  getOrgDeveloperOne(id: string) {
    return this.httpClient.get<IResponse<IDeveloperOne>>(`${environment.BASE_URL_SERVICE_ADMIN}/organization/developer/one?id=${id}`);
  }

  getOrgDeveloperSearch(doc: string) {
    return this.httpClient.get<any>(`${environment.BASE_URL_SERVICE_ADMIN}/organization/developer-search?doc=${doc}`);
  }
}
