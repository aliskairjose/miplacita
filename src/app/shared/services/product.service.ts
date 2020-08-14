import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { Product } from '../classes/product';

@Injectable( {
  providedIn: 'root'
} )
export class ProductService {

  $product: Subject<Product> = new Subject<Product>();

  constructor(
    private http: HttpService
  ) { }

  /**
   * @description Lista de productos
   */
  productList(): Observable<Product[]> {
    return this.http.get( '' );
  }

  /**
   * @description Detalle de un producto
   * @param Id Id del producto a consultar
   */
  getProduct( id: number ): Observable<Product> {
    return this.http.get( `product/${id}` );
  }

  /**
   * @description Crea un nuevo producto
   * @param data Detale del producto
   */
  addProduct( data: Product): Observable<any>{
    return this.http.post('products', data);
  }


  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   * @param product
   */
  productSubject( product: Product ): void {
    this.$product.next( product );
  }

  /**
   * @description Creación del observer mediante el método asObserver(), el cual sera consumido por el componente
   */
  productObserver(): Observable<Product> {
    return this.$product.asObservable();
  }

}
