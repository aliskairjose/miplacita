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
   * @description Crea un nuevo producto
   * @param data Detale del producto
   */
  addProduct( data: Product ): Observable<any> {
    return this.http.post( 'products', data );
  }

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
  getProduct( id ): Observable<Product> {
    return this.http.get( `product/${id}` );
  }

  /**
   * @description Actualizacion del producto
   * @param id Id del producto a actualizar
   * @param data Data de producto
   */
  updateProduct( id, data: Product ): Observable<any> {
    return this.http.put( `products/${id}`, data );
  }

  // Product Photo ---------------------------------------------------------------

  /**
   * @description Agregar foto al producto
   * @param id Id del producto al cual se agrega photo
   * @param data Url de la photo
   */
  addProductoPhoto( id, data: string ): Observable<any> {
    return this.http.post( `products/${id}/photo`, data );
  }

  /**
   * @description Eliminando photo de producto
   */
  deletePhoto( id, idPhoto, data: string ): Observable<any> {
    return this.http.delete( `products/${id}/photo/${idPhoto}`, data );
  }

  /**
   * @description Coloca la foto como principal
   * @param id Id del producto
   * @param idPhoto id de la foto
   * @param data Data vacia
   */
  setMainPhoto( id, idPhoto, data = '' ): Observable<any> {
    return this.http.put( `products/${id}/photo/${idPhoto}`, data );
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
