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

  dashboardStore( param: any ): Observable<Dashboard> {
    return this.http.get( `dashboard/store?${param}` ).pipe( map( result => result.dashboard ) );
  }

  dashboard(): Observable<any> {
    return this.http.get( 'dashboard' );
  }


}
