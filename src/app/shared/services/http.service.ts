import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  post( endpoint: string, data: any ): Observable<any> {
    const url = environment.apiUrl + endpoint;
    return this.http.post( url, data );
  }

  get( endpoint: string ): Observable<any> {
    const url = environment.apiUrl + endpoint;
    return this.http.get( url );
  }

  put( endpoint: string, data: any ): Observable<any> {
    const url = environment.apiUrl + endpoint;
    return this.http.put( url, data );
  }

  patch(endpoint: string, data: any ): Observable<any> {
    const url = environment.apiUrl + endpoint;
    return this.http.patch( url, data);
  }

  delete(endpoint: string, data: any ): Observable<any> {
    const url = environment.apiUrl + endpoint;
    return this.http.delete( url, data);
  }
}
