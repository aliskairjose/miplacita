import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { Dashboard } from '../classes/dashboard';
import { map } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class DashboardService {
  constructor(
    private http: HttpService
  ) { }

  /**
   * @description Registro de dueño de tienda
   * @param params Datos del registro
   */
  dashboard(): Observable<any> {
    return this.http.get( 'dashboard' );
  }


}
