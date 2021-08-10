import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IPagination } from '../_interfaces/pagination.interface';
import { IInstitutionData, IOrganization, IOrganizationUpdateRequest } from '../_interfaces/institution.interface';
import { IResponse } from '../_interfaces/response.interface';
import { ICatalogAdmin } from '../_interfaces/catalog.interface';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private cacheCatalogLocalData$: Observable<any>;

  constructor(private _httpClient: HttpClient) { }

  getAdminOrganization(word?: string, page: number = 1, count: number = 5) {
    const _word = ![null, '', undefined].includes(word?.trim()) ? `word=${encodeURI(word.trim())}` : 'word';
    const _page = `page=${page}`;
    const _count = `count=${count}`;

    const _arrayParam = [_word, _page, _count];
    const params = _arrayParam.join('&');
    return this._httpClient.get<IPagination<IOrganization>>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/organization?${params}`);
  }

  getAdminOrganizationSearch(code: string) {
    return this._httpClient.get<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/organization-search?code=${code}`);
  }
  getAdminOrganizationInfo(id: string) {
    return this._httpClient.get<IResponse<IInstitutionData>>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/organization/info?id=${id}`);
  }

  putAdminOrganizationUpdate(request: IOrganizationUpdateRequest) {
    return this._httpClient.put<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/organization-update`, request);
  }
  postAdminOrganizationInsert(request: IOrganizationUpdateRequest) {
    return this._httpClient.post<any>(`${environment.BASE_URL_SERVICE_ADMIN}/admin/organization-insert`, request);
  }

  async getAdminCatalogAdmin(category: string) {
    const catalogStorage = await this.getCacheCatalogData() ?? [];
    return catalogStorage.filter(x => x.category === category);
  }

  private async getCacheCatalogData() {
    const URL = `${environment.BASE_URL_SERVICE_ADMIN}/admin/catalog?category=&status=true`;

    const catalogStorageStr = localStorage.getItem("catalog-storage") ?? null;
    let catalogStorage = JSON.parse(catalogStorageStr);

    if (!catalogStorage) {
      const response = await this._httpClient.get<any>(URL).toPromise();
      catalogStorage = response;
      localStorage.setItem("catalog-storage", JSON.stringify(response));
    }

    return catalogStorage;
  }

}
