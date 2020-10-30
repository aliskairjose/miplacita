import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Response, Result } from '../classes/response';
import { Order } from '../classes/order';
import { map } from 'rxjs/operators';
import { User } from '../classes/user';
import { Product } from '../classes/product';
import { ObsEvent } from 'ng-lazyload-image/src/types';
import { Store } from '../classes/store';

@Injectable( {
  providedIn: 'root'
} )
export class ReportsService {

  constructor(
    private http: HttpService
  ) { }

  /*
  ---------------------------------------------
  -------------  MP Reports  ------------------
  ---------------------------------------------
  */

  /**
   * @description Reortes de clientes MP
   * @param role client | merchant
   * @param from Fecha de incio
   * @param to Fecha final
   */
  clientsMP( role: string, from: string, to: string ): Observable<any> {
    const params = `from=${from}&to=${to}&role=${role}`;
    console.log( params );
    return this.http.get( `report/getClients?${params}` );
  }

  /**
   * @description Reorte de ventas diarias por producto MP
   */
  dailySalesProductsMP(): Observable<any> {
    return this.http.get( `` );
  }

  /**
   * @description Reorte de ventas diarias por producto
   */
  dailySalesProducts(): Observable<any> {
    return this.http.get( `` );
  }

  /**
   * @description Reporte de Ordenes MP
   */
  ordersMP(): Observable<any> {
    return this.http.get( `` );
  }

  /**
   * @description Reporte productos mas vendidos MP
   */
  bestSellersMP(): Observable<any> {
    return this.http.get( `` );
  }

  /*
    ---------------------------------------------
    -------------  Products Reports  ------------
    ---------------------------------------------
  */

  /**
   * @description Reporte de los mas vendidos de la tienda
   * @param page Pagina que desea mostrar
   * @param params ID Id de la tienda
   */
  bestSellers( page = 1, params = '' ): Observable<Result<Product>> {
    return this.http.get( `products?page=${page}&${params}` ).pipe(
      map( ( response: Response<Product> ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }

  stockMP(): Observable<Result<Product>> {
    return this.http.get( `` );
  }

  percentageMpSales(): Observable<Result<any>> {
    return this.http.get( `` );
  }


  /*
    ---------------------------------------------
    -------------  Shop Reports  ----------------
    ---------------------------------------------
  */

  /**
   * @description Reporte de clientes por Tienda
   * @param id Id de a tienda
   * @param from Fecha de incio
   * @param to Fecha final
   */
  clientsByStore( id: string, from: string, to: string ): Observable<any> {
    return this.http.get( `api/client?store=${id}&from=${from}&to=${to}` )
  }

  /**
   * @description lista de clientes de una tienda
   * @param Id Id de tienda
   */
  clients( params: string ): Observable<Result<User>> {
    return this.http.get( `client?${params}` ).pipe(
      map( ( response: Response<User> ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }

  /**
   * @description Reporte de ventas totales
   * @param Id Id de la tienda
   * @param FechaInicio Fecha Inicio del reporte
   * @param FechaFin Fecha Fin del reporte
   */
  totalSales( params: string ): Observable<Array<any>> {
    return this.http.get( `sales?${params}` ).pipe(
      map( ( response ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }

  /**
   * @description Reporte de ventas con TDC
   */
  tdcSales(): Observable<any> {
    return this.http.get( `` );
  }

  /**
   * ! Esta temporalmente mostrando todas las tiendas, activas e inactivas, debe cambiarse el api
   * @description Reporte de tiendas activas con membresia
   */
  membershipActiveShop( page = 1, params = '' ): Observable<Store[]> {
    return this.http.get( `stores?page=${page}&${params}` ).pipe(
      map( response => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }

  /**
   * @description Reporte de pagos de tiendas
   */
  storesPayment(): Observable<any> {
    return this.http.get( `` );
  }


  /*
    ---------------------------------------------
    -------------  Orders Reports  --------------
    ---------------------------------------------
  */

  /**
   * @description Lista las ventas diarias de la tienda
   * @param page Pagina a consultar
   * @param params Id de la tienda | Fecha
   */
  dailySales( page = 1, params = '' ): Observable<Result<Order>> {
    return this.http.get( `order?page=${page}&${params}` ).pipe(
      map( ( response: Response<Order> ) => {
        return response.result;
      } )
    );
  }

}
