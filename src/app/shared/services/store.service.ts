import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';
import { Store } from '../classes/store';
import { map } from 'rxjs/operators';
import { Plan } from '../classes/plan';
import { Response, Result } from '../classes/response';

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
   * @description Retorna el detalle de la tienda cuando recibe ID, y un listado si no recibe el ID
   * @param id Id de la tienda
   */
  getStore( id?: string ): Observable<Result<Store[]>> {
    return this.http.get( `stores?store=${id}` ).pipe(
      map( ( response: Response<Store[]> ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }


  /**
   * @description Retorna la lista de las tiendas de un usuario
   * @param id Id del usuario
   */
  getMyStores(): Observable<Result<Store>> {
    return this.http.get( '' ).pipe(
      map( ( response: Response<Store> ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }

  /**
   * @description Retorna la lista de todas las tiendas
   * @param id Id de la tienda
   */
  getAll( page = 1 ): Observable<Result<Store>> {
    return this.http.get( `stores?page=${page}` ).pipe(
      map( ( response: Response<Store> ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }

  /**
   * @description Actualiza la data de la tienda
   * @param id Id de la tienda
   * @param data Data de tipo Tienda
   */
  updateStore( id: string, data: Store ): Observable<any> {
    return this.http.put( `stores/${id}`, data );
  }

  /**
   * @description Carga las imagenes en Cloudinary
   * @returns Retorna un listado de url de imagenes
   * @param data Array de imagenes en base 64
   */
  uploadImages( data: any ): Observable<any> {
    return this.http.post( 'files', data );
  }

  /**
   * @description Valida que el nombre de la tienda este o no en uso por otro usuario
   * @param name Nombre de la tienda a consultar
   */
  validateName( name: string ): Observable<any> {
    // tslint:disable-next-line: prefer-const
    let data: any;
    return this.http.post( `stores/validate?name=${name}`, data );
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
