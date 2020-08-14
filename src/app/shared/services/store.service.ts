import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private http: HttpService
  ) { }

  addStore(data: any): Observable<any> {
    return this.http.post('stores', data);
  }
}
