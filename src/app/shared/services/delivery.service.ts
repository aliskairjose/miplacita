import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Delivery } from '../classes/delivery';

@Injectable( {
  providedIn: 'root'
} )
export class DeliveryService {

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

}
