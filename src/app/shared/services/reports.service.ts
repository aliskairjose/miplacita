import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Response, Result } from '../classes/response';
import { Order } from '../classes/order';
import { map } from 'rxjs/operators';
import { User } from '../classes/user';
import { Product } from '../classes/product';

@Injectable( {
  providedIn: 'root'
} )
export class ReportsService {

  constructor(
    private http: HttpService
  ) { }


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


  /*
    ---------------------------------------------
    -------------  Shop Reports  ----------------
    ---------------------------------------------
  */

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
