import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';
import { Store } from '../classes/store';
import { map } from 'rxjs/operators';
import { Plan } from '../classes/plan';
import { Response, Result } from '../classes/response';
import { ShipmentOption } from '../classes/shipment-option';

@Injectable( {
  providedIn: 'root'
} )
export class ShopService {

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
  getStore( id?: string ): Observable<Result<Store>> {
    return this.http.get( `stores?store=${id}` ).pipe(
      map( ( response: Response<Store> ) => {
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

  updateStorePlan( storeId: string, planId: any ): Observable<any> {
    return this.http.put( `stores/${storeId}/plan`, planId );
  }

  /**
   * @description Configuración de la tienda
   * @param id Id de la tienda
   * @param data Configuracón de la tienda, Color | Font
   */
  config( id: string, data: any ): Observable<any> {
    return this.http.put( `stores/${id}/config`, data );
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

  /*
    ---------------------------------------------
    -------------  Perfil de tienda  ------------
    ---------------------------------------------
  */

  /**
   * @description Retiro de dinero de ventas de tienda
   * @param data Datos para el retiro de dinero
   * @param id Id de la tienda
   */
  withdrawals( data: any, id: string ): Observable<any> {
    return this.http.put( `stores/${id}/bank`, data );
  }

  /**
   * @description Carga de imagen al banner
   * @param shopId Id de la tienda a la que se coloca el banner
   * @param data Banner
   */
  addBanner( shopId: string, data: any ): Observable<any> {
    return this.http.post( `stores/${shopId}/config/photo`, data );
  }

  /*
    ---------------------------------------------
    --------------  ShipmentOptions  ------------
    ---------------------------------------------
  */

  /**
   * @description Crea una nueva opcion de envio para la tienda
   * @param data Datos de Opciones de envio
   */
  addShipmetZone( data: any ): Observable<any> {
    return this.http.post( 'shipment', data ).pipe(
      map( result => {
        // tslint:disable-next-line: curly
        if ( result.status === 'isOk' ) return result.shipment_option;
      } )
    );
  }

  /**
   * @description Busca las opciones de envío por tienda
   * @param id Id de la Tienda a consultar las opciones de envio
   */
  findShipmentOptionByShop( id: string ): Observable<ShipmentOption[]> {
    return this.http.get( `shipment?store=${id}` ).pipe(
      map( result => {
        // tslint:disable-next-line: curly
        if ( result.status === 'isOk' ) return result.shipments;
      } )
    );
  }

  /**
   * @description Actualiza la opción de envío
   * @param id Id de la opcion de envio
   * @param data Data actualizada
   */
  updateShipmetOptions( id: string, data: any ): Observable<ShipmentOption> {
    return this.http.put( `shipment/${id}`, data ).pipe(
      map( result => {
        // tslint:disable-next-line: curly
        if ( result.status === 'isOk' ) return result.shipment_option;
      } )
    );
  }

  /**
   * @description Elimina la opción de envío solicitada por ID
   * @param id Id de la opción de envío a eliminar
   */
  deleteShipmentOptions( id: string ): Observable<any> {
    return this.http.delete( `shipment/${id}` );
  }

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
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
