import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private httpClient: HttpClient) { }

  getImage(imageUrl: string) {
    let headers = { responseType: 'blob' };
    return this.httpClient.get<Blob>(imageUrl, { headers })
  }
}
