import { Injectable } from '@angular/core';
import { Commission } from '../classes/commissions';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class CommissionService {

  constructor(
    private http: HttpService
  ) { }


  /**
   * @description Listado de comision
   * @returns Comision existente
   */
  getCommission(): Observable<Commission> {
    return this.http.get( 'commissions/show' ).pipe(
      map( response => {
        if ( response.success ) { return response.commissions; }
      } )
    );
  }

  /**
   * 
   * @param id Id de la comision a actualizar
   */
  updateCommission( id: string, data: Commission ): Observable<any> {
    return this.http.put( `commissions/${id}`, data );
  }
}
