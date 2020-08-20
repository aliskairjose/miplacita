import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';
import { Store } from '../classes/store';
import { map } from 'rxjs/operators';
import { Plan } from '../classes/plan';

@Injectable( {
  providedIn: 'root'
} )
export class StoreService {

  $store: Subject<Store> = new Subject<Store>();

  constructor(
    private http: HttpService
  ) { }

  getPlans(): Observable<Plan[]> {
    return this.http.get( 'plan' ).pipe(
      map( response => {
        if ( response.success ) {
          return response.planes;
        }
      } )
    );
  }

  /**
   * @description Crea una nueva tienda
   * @param data Data de tipo Store
   */
  addStore( data: Store ): Observable<Store> {
    return this.http.post( 'stores', data ).pipe(
      map( response => {
        if ( response.success ) {
          return response.store;
        }
      } )
    );
  }

  /**
   * @description Retorna el detalle de la tienda
   * @param id Id de la tienda
   */
  getStore( id: string ): Observable<Store> {
    return this.http.get( `stores/${id}` );
  }

  /**
   * @description Actualiza la data de la tienda
   * @param id Id de la tienda
   * @param data Data de tipo Tienda
   */
  updateStore( id: string, data: Store ): Observable<any> {
    return this.http.put( `storea/${id}`, data );
  }

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   * @param store
   */
  storeSubject( store: Store ): void {
    this.$store.next( store );
  }

  /**
   * @description Creación del observer mediante el método asObserver(), el cual sera consumido por el componente
   */
  storeObserver(): Observable<Store> {
    return this.$store.asObservable();
  }

}
