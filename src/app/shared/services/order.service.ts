import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';
import { Order } from '../classes/order';
import { Response, Result } from '../classes/response';
import { map } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  $order: Subject<Order> = new Subject<Order>();

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
  getOrder( id: string ): Observable<Order> {
    return this.http.get( `order/${id}` );
  }

  /**
   * @description Retorna la lista de ordenes de una tienda es específico
   * @param id ID de la tienda a consultar las ordenes
   * @returns Observable de array de ordenes
   */
  orderList( id: string, page = 1 ): Observable<Result<Order>> {
    return this.http.get( `order?store=${id}` ).pipe(
      map( ( response: Response<Order> ) => {
        return response.result;
      } )
    );
  }

  /**
   * @description Retorna todas las ordenes de la tienda
   * @param id Id de la tienda
   */
  getAll( page = 1 ): Observable<Result<Order>> {
    return this.http.get( `order?page=${page}` ).pipe(
      map( ( response: Response<Order> ) => {
        return response.result;
      } )
    );
  }


  /**
   * @description Retorna el listado de clientes del usuario logueado
   */
  clientList(): Observable<any> {
    return this.http.get( 'order/list/clients' );
  }

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   * @param order
   */
  orderSubject( order: Order ): void {
    this.$order.next( order );
  }

  /**
   * @description Creación del observer mediante el método asObserver(), el cual sera consumido por el componente
   */
  orderObserver(): Observable<Order> {
    return this.$order.asObservable();
  }
}
