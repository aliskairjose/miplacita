import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';
import { Delivery } from '../classes/delivery';

@Injectable( {
  providedIn: 'root'
} )
export class DeliveryService {

  $delivery: Subject<Delivery> = new Subject<Delivery>();

  constructor(
    private http: HttpService
  ) { }

  /**
   * @description Agrega Delivery al pedido
   * @param data Data de tipo Delivery
   */
  addDelivery( data: Delivery ): Observable<any> {
    return this.http.post( 'delivery', data );
  }

  /**
   * @description Actualización de la data delivery
   * @param id Id del delivery a actualizar
   * @param data Nueva data
   */
  updateDelivery( id: string, data: Delivery ): Observable<any> {
    return this.http.put( `delivery/${id}`, data );
  }

  /**
   * @description Elimina el dellivery existente
   * @param id Id del delivery a eliminar
   */
  deleteDelivery(id: string): Observable<any> {
    return this.http.delete(`delivery/${id}`);
  }

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   * @param delivery
   */
  deliverySubject( delivery: Delivery ): void {
    this.$delivery.next( delivery );
  }

  /**
   * @description Creación del observer mediante el método asObserver(), el cual sera consumido por el componente
   */
  deliveryObserver(): Observable<Delivery> {
    return this.$delivery.asObservable();
  }

}
