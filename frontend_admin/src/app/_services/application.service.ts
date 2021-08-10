import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPagination } from '../_interfaces/pagination.interface';
import { IServiceItem } from '../_interfaces/service.interface';
import { IResponse } from '../_interfaces/response.interface';
import { IApplicationItem } from '../_interfaces/application.interface';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {


  constructor(private _httpClient: HttpClient) { }


 


}
