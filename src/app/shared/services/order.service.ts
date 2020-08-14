import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Order } from '../classes/order';

@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  constructor(
    private http: HttpService
  ) { }

  /**
   * @description Crea una nueva Orden
   * @param data Data de tipo Order
   */
  addOrder( data: Order ): Observable<any> {
    return this.http.post( 'order', data );
  }

  /**
   * @description Retorna el detalle de la orden
   * @param id Id de la orden
   */
  getOrder( id ): Observable<Order> {
    return this.http.get( `order/${id}` );
  }

  /**
   * @description Retorna todas las ordenes de la tienda
   * @param id Id de la tienda
   */
  getAll( id ): Observable<Order[]> {
    return this.http.get( `order?store=${id}` );
  }


  /**
   * @description Retorna el listado de clientes del usuario logueado
   */
  clientList(): Observable<any> {
    return this.http.get( 'order/list/clients' );
  }
}
