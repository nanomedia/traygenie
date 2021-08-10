import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IApplicationModel } from '../_models/application.model';
import { environment } from 'src/environments/environment';
import { IAppInfoResponse, IAppItemResponse, IAppOneResponse, IAppOrganization, IAppUpdateRequest } from '../_interfaces/application.interface';
import { IResponse } from '../_interfaces/response.interface';
import { IPagination } from '../_interfaces/pagination.interface';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private appIdSource = new BehaviorSubject<string>(null);
  private appSource = new BehaviorSubject<IAppOneResponse>(null);
  private appNameSource = new BehaviorSubject<string>(null);
  private servicesSource = new BehaviorSubject<string[]>(null);

  constructor(private httpClient: HttpClient) {
  }

  setAppCurrentId(id: string) {
    this.appIdSource.next(id);
  }

  getAppCurrentId(): Observable<string> {
    return this.appIdSource.asObservable();
  }

  getCurrentApp() {
    return this.appSource.asObservable();
  }

  setCurrentApp(app: IAppOneResponse) {
    return this.appSource.next(app);
  }

  getAppCurrentSubjet(): BehaviorSubject<string> {
    return this.appIdSource;
  }

  setServicesSource(services: string[]) {
    this.servicesSource.next(services);
  }

  getServicesSource(): Observable<string[]> {
    return this.servicesSource.asObservable();
  }

  // setAppNameSource(name: string) {
  //   this.appNameSource.next(name);
  // }

  // getAppNameSource(): Observable<string> {
  //   return this.appNameSource.asObservable();
  // }

  postApplicationAppInsert(request: IApplicationModel) {

    const formData = new FormData();
    formData.append('name', request.name);
    formData.append('description', request.description);
    formData.append('url', request.url);
    formData.append('organization_code', request.organization_code);
    formData.append('logo', request.logo);

    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/app-insert`;
    return this.httpClient.post<IResponse<any>>(url, formData);
  }

  putApplicationAppUpdate(request: IAppUpdateRequest) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/app-update`;
    return this.httpClient.put<IResponse<any>>(url, request);
  }

  delApplicationAppDeleted(id: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id }
    };

    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/app-deleted`;
    return this.httpClient.delete<IResponse<any>>(url, httpOptions);

  }
  getApplicationApp(word?: string, page: number = 1, count: number = 5) {
    const _word = ![null, '', undefined].includes(word?.trim()) ? `name=${encodeURI(word.trim())}` : 'name';
    const _page = `page=${page}`;
    const _count = `count=${count}`;
    const _arrayParam = [_word, _page, _count];
    const params = _arrayParam.join('&');
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/app?${params}`;
    return this.httpClient.get<IPagination<IAppItemResponse>>(url);
  }

  getApplicationAppOne(id: string) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/app/one?id=${id}`;
    return this.httpClient.get<IResponse<IAppOneResponse>>(url);
  }

  getApplicationAppInfo(id: string) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/app/info?id=${id}`;
    return this.httpClient.get<IResponse<IAppInfoResponse>>(url);
  }

  getApplicationOrganizationServices(id: string) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/organization/services?id=${id}`;
    return this.httpClient.get<IResponse<string[]>>(url);
  }

  getApplicationOrganizationCode(code: string) {
    const url = `${environment.BASE_URL_SERVICE_ADMIN}/application/organization/code?code=${code}`;
    return this.httpClient.get<IResponse<IAppOrganization>>(url);
  }

}
