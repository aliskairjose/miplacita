import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Response, Result } from '../classes/response';
import { map } from 'rxjs/operators';
import { User } from '../classes/user';
import { Product } from '../classes/product';
import { UserService } from './user.service';

@Injectable( {
  providedIn: 'root'
} )
export class ReportsService {

  constructor(
    private http: HttpService,
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
    return this.http.get( `report/getClients?${params}` );
  }

  /**
   * @description Reorte de ventas diarias por producto
   */
  dailySalesProducts( params = '' ): Observable<any> {
    return this.http.get( `report/getSalesReport?${params}` );
  }

  /**
   * @description Reporte de Ordenes MP
   */
  ordersMP( params: string ): Observable<any> {
    return this.http.get( params );
  }

  /**
   * @description Reporte productos mas vendidos MP
   */
  bestSellersMP( params = '' ): Observable<any> {
    return this.http.get( `products?${params}` );
  }

  /**
   * @description 20% vs % de la tienda
   * @param params from=2020-11-05&to=2020-11-06&store=IDTIENDA
   */
  percentageMpSales( params: string ): Observable<any> {
    return this.http.get( `report/commissions/?${params}` );
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
  bestSellers( params: string ): Observable<any[]> {
    return this.http.get( `report/bestseller?${params}` ).pipe(
      map( response => response.result )
    );
  }
  // bestSellers( page = 1, params = '' ): Observable<Product[]> {
  //   return this.http.get( `products?page=${page}&${params}` ).pipe(
  //     map( ( response ) => {
  //       if ( response.success ) {
  //         return response.result;
  //       }
  //     } )
  //   );
  // }

  stockMP(): Observable<any> {
    return this.http.get( `products?marketplace=true&report=true` ).pipe(
      map( response => response.result )
    );
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
    return this.http.get( `api/client?store=${id}&from=${from}&to=${to}` );
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
   * @param params FECHA INI FECHA FIN
   */
  tdcSales( params: string ): Observable<any> {
    return this.http.get( `report/tdc?${params}` ).pipe( map( response => response.result ) );
  }

  /**
   *
   * @description Reporte de tiendas activas con membresia
   */
  membershipActiveShop( page = 1, params = '' ): Observable<any> {
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
  dailySales( params = '' ): Observable<any> {
    return this.http.get( `order?page=${params}` ).pipe(
      map( ( response ) => {
        if ( response.success ) { return response.result; }
      } )
    );
  }

}
