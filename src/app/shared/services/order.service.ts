import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';
import { Order } from '../classes/order';
import { Response, Result } from '../classes/response';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

const state = {
  checkoutItems: JSON.parse( localStorage.checkoutItems || '[]' )
};
@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  $order: Subject<Order> = new Subject<Order>();

  constructor(
    private router: Router,
    private http: HttpService,
    private storage: StorageService,
  ) { }

  // Get Checkout Items
  public get checkoutItems(): Observable<any> {
    const itemsStream = new Observable( observer => {
      observer.next( state.checkoutItems );
      observer.complete();
    } );
    return itemsStream as Observable<any>;
  }

  /**
   * @description Crea una nueva Orden
   * @param data Data de tipo Order
   */
  createOrder( data: any ) {
    state.checkoutItems = data;
    this.storage.setItem( 'checkoutItems', data );
    this.storage.removeItem( 'cartItems' );
    return this.http.post( 'order', data );
    // this.router.navigate( [ '/shop/checkout/success', orderId ] );
  }

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
   * @description Lista las ordenes segun los parametros, si params esta vacio lista todas las ordenes (admin)
   * @param page Pagina a consultar
   * @param params store | status | orderBy
   */
  orderList( page = 1, params = '' ): Observable<Result<Order>> {
    return this.http.get( `order?page=${page}&${params}`  ).pipe(
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
   * @description Actualiza el estatus de la orden enviando el estatus y el id de la orden
   * @param data Status a actualizar
   * @param id Id de la orden a actualizar
   */
  updateStatus( data: any, id: string ): Observable<any> {
    return this.http.put( `order/update-status/${id}`, data );
  }

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   * @param order Data de tipo Orden
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
