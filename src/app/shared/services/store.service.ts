import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Store } from '../classes/store';

@Injectable( {
  providedIn: 'root'
} )
export class StoreService {

  constructor(
    private http: HttpService
  ) { }


  /**
   * @description Crea una nueva tienda
   * @param data Data de tipo Store
   */
  addStore( data: Store ): Observable<any> {
    return this.http.post( 'stores', data );
  }

  /**
   * @description Retorna el detalle de la tienda
   * @param id Id de la tienda
   */
  getStore( id ): Observable<Store> {
    return this.http.get( `stores/${id}` );
  }

  /**
   * @description Actualiza la data de la tienda
   * @param id Id de la tienda
   * @param data Data de tipo Tienda
   */
  updateStore( id, data: Store ): Observable<any> {
    return this.http.put( `storea/${id}`, data );
  }
}
