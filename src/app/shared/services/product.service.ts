import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { Product } from '../classes/product';
import { map } from 'rxjs/operators';
import { Category } from '../classes/category';
import { Response, Result } from '../classes/response';

@Injectable( {
  providedIn: 'root'
} )
export class ProductService {

  $product: Subject<Product> = new Subject<Product>();
  selectedProduct: Product;

  constructor(
    private http: HttpService
  ) { }

  /**
   * @description Retorna la lista de categorias!
   */
  categoryList(): Observable<Category[]> {
    return this.http.get( 'categories' ).pipe(
      map( ( response ) => {
        if ( response.success ) {
          return response.categories;
        }
      } )
    );
  }

  /**
   * @description Crea un nuevo producto
   * @param data Detale del producto
   */
  addProduct( data: Product ): Observable<Product> {
    return this.http.post( 'products', data ).pipe(
      map( response => {
        if ( response.success ) {
          return response.product;
        }
      } )
    );
  }

  /**
   * @description Listado de productos de la tienda
   * @param id Id de la tienda
   * @param page Numero de la pagina a mostrar
   */
  productList( id: string, page = 1 ): Observable<Result<Product>> {
    return this.http.get( `products?page=${page}&store=${id}` ).pipe(
      map( ( response: Response<Product> ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }
  /**
   * @description Lista de todos los productos
   */
  getAll( page = 1 ): Observable<Result<Product>> {
    return this.http.get( `products?page=${page}` ).pipe(
      map( ( response: Response<Product> ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }

  /**
   * @description Detalle de un producto
   * @param Id Id del producto a consultar
   */
  productDetail( id: string ): Observable<Result<Product>> {
    return this.http.get( `products?product=${id}` ).pipe(
      map( ( response: Response<Product> ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }

  deleteProduct( id: string): Observable<any> {
    return this.http.delete(`products/${id}`);
  }

  /**
   * @description Actualizacion del producto
   * @param id Id del producto a actualizar
   * @param data Data de producto
   */
  updateProduct( id, data: Product ): Observable<any> {
    return this.http.put( `products/${id}`, data );
  }

  /**
   * @description Valida que el nombre del producto este o no en usi
   * @param name Nombre de la tienda a consultar
   */
  validateName( name: string ): Observable<any> {
    // tslint:disable-next-line: prefer-const
    let data: any;
    return this.http.post( `products/validate?name=${name}`, data );
  }


  // Product Photo ---------------------------------------------------------------

  /**
   * @description Agregar foto al producto
   * @param id Id del producto al cual se agrega photo
   * @param data Url de la photo
   */
  addProductoPhoto( id: string, data: string ): Observable<any> {
    return this.http.post( `products/${id}/photo`, data );
  }

  /**
   * @description Eliminando photo de producto
   */
  deletePhoto( id: string, ): Observable<any> {
    return this.http.delete( `products/photo/${id}` );
  }

  /**
   * @description Coloca la foto como principal
   * @param id Id del producto
   * @param idPhoto id de la foto
   * @param data Data vacia
   */
  setMainPhoto( id: string, idPhoto, data = '' ): Observable<any> {
    return this.http.put( `products/${id}/photo/${idPhoto}`, data );
  }

  /**
   * @description Carga las imagenes en Cloudinary
   * @returns Retorna un listado de url de imagenes
   * @param data Array de imagenes en base 64
   */
  uploadImages( data: any ): Observable<any> {
    return this.http.post( 'files', data );
  }

  /*
   ---------------------------------------------
   ------------- Product Pagination  -----------
   ---------------------------------------------
 */
  public getPager( totalItems: number, currentPage: number = 1, pageSize: number = 16 ) {
    // calculate total pages
    const totalPages = Math.ceil( totalItems / pageSize );

    // Paginate Range
    const paginateRange = 3;

    // ensure current page isn't out of range
    if ( currentPage < 1 ) {
      currentPage = 1;
    } else if ( currentPage > totalPages ) {
      currentPage = totalPages;
    }

    let startPage: number;
    let endPage: number;

    if ( totalPages <= 5 ) {
      startPage = 1;
      endPage = totalPages;
    } else if ( currentPage < paginateRange - 1 ) {
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    // calculate start and end item indexes
    const startIndex = ( currentPage - 1 ) * pageSize;
    const endIndex = Math.min( startIndex + pageSize - 1, totalItems - 1 );

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from( Array( ( endPage + 1 ) - startPage ).keys() ).map( i => startPage + i );

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages
    };
  }

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   */
  productSubject( product: Product ): void {
    this.$product.next( product );
  }

  /**
   * @description Creación del observer mediante el método asObserver(), el cual sera consumido por el componente
   * @returns Observable product
   */
  productObserver(): Observable<Product> {
    return this.$product.asObservable();
  }

}
