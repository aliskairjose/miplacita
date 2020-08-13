import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { Product } from '../classes/product';

@Injectable( {
  providedIn: 'root'
} )
export class ProductService {

  product$: Subject<Product> = new Subject<Product>();

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
    return this.http.get( `/${id}` );
  }


  productSubject( product: Product ): void {
    this.product$.next( product );
  }

  productObjerver(): Observable<Product> {
    return this.product$;
  }

}
