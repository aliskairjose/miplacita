import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { Product } from '../classes/product';
import { map } from 'rxjs/operators';
import { Category } from '../classes/category';
import { Response, Result } from '../classes/response';
import { ToastrService } from 'ngx-toastr';

const state = {
  products: JSON.parse( localStorage.products || '[]' ),
  wishlist: JSON.parse( localStorage.wishlistItems || '[]' ),
  compare: JSON.parse( localStorage.compareItems || '[]' ),
  cart: JSON.parse( localStorage.cartItems || '[]' )
};

@Injectable( {
  providedIn: 'root'
} )
export class ProductService {

  $product: Subject<Product> = new Subject<Product>();
  selectedProduct: Product;
  OpenCart = false;

  constructor(
    private http: HttpService,
    private toastrService: ToastrService
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
   * @description Obtiene un listado de productos o informción del detalle de un producto o productos de tienda
   * @param page Pagina que desea mostrar
   * @param params Los filtros que seran enviados al api, si se envia vacio traera todos los productos
   * Id store | id product
   */
  productList( page = 1, params = '' ): Observable<Result<Product>> {
    return this.http.get( `products?page=${page}&${params}` ).pipe(
      map( ( response: Response<Product> ) => {
        if ( response.success ) {
          return response.result;
        }
      } )
    );
  }

  deleteProduct( id: string ): Observable<any> {
    return this.http.delete( `products/${id}` );
  }

  /**
   * @description Actualizacion del producto
   * @param id Id del producto a actualizar
   * @param data Data de producto
   */
  updateProduct( id: string, data: Product ): Observable<any> {
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
    ---------------  Wish List  -----------------
    ---------------------------------------------
  */

  // Get Wishlist Items
  public get wishlistItems(): Observable<Product[]> {
    const itemsStream = new Observable( observer => {
      observer.next( state.wishlist );
      observer.complete();
    } );
    return itemsStream as Observable<Product[]>;
  }

  // Add to Wishlist
  public addToWishlist( product: Product ): any {
    const wishlistItem = state.wishlist.find( item => item.id === product._id );
    if ( !wishlistItem ) {
      state.wishlist.push( {
        ...product
      } );
    }
    this.toastrService.success( 'Product has been added in wishlist.' );
    localStorage.setItem( 'wishlistItems', JSON.stringify( state.wishlist ) );
    return true;
  }

  // Remove Wishlist items
  public removeWishlistItem( product: Product ): any {
    const index = state.wishlist.indexOf( product );
    state.wishlist.splice( index, 1 );
    localStorage.setItem( 'wishlistItems', JSON.stringify( state.wishlist ) );
    return true;
  }

  /*
    ---------------------------------------------
    -------------  Compare Product  -------------
    ---------------------------------------------
  */

  // Get Compare Items
  public get compareItems(): Observable<Product[]> {
    const itemsStream = new Observable( observer => {
      observer.next( state.compare );
      observer.complete();
    } );
    return itemsStream as Observable<Product[]>;
  }

  // Add to Compare
  public addToCompare( product: Product ): any {
    const compareItem = state.compare.find( item => item._id === product._id );
    if ( !compareItem ) {
      state.compare.push( {
        ...product
      } );
    }
    this.toastrService.success( 'Product has been added in compare.' );
    localStorage.setItem( 'compareItems', JSON.stringify( state.compare ) );
    return true;
  }

  // Remove Compare items
  public removeCompareItem( product: Product ): any {
    const index = state.compare.indexOf( product );
    state.compare.splice( index, 1 );
    localStorage.setItem( 'compareItems', JSON.stringify( state.compare ) );
    return true;
  }

  /*
    ---------------------------------------------
    -----------------  Cart  --------------------
    ---------------------------------------------
  */

  // Get Cart Items
  public get cartItems(): Observable<Product[]> {
    const itemsStream = new Observable( observer => {
      observer.next( state.cart );
      observer.complete();
    } );
    return itemsStream as Observable<Product[]>;
  }

  // Add to Cart
  public addToCart( product: Product ): any {
    const cartItem = state.cart.find( item => item._id === product._id );
    const qty = product.quantity ? product.quantity : 1;
    const items = cartItem ? cartItem : product;
    const stock = this.calculateStockCounts( items, qty );

    if ( !stock ) { return false; }

    if ( cartItem ) {
      cartItem.quantity += qty;
    } else {
      state.cart.push( {
        ...product,
        quantity: qty
      } );
    }

    this.OpenCart = true; // If we use cart variation modal
    localStorage.setItem( 'cartItems', JSON.stringify( state.cart ) );
    return true;
  }

  // Update Cart Quantity
  updateCartQuantity( product: Product, quantity: number ): Product | boolean {
    return state.cart.find( ( items, index ) => {
      if ( items.id === product._id ) {
        const qty = state.cart[ index ].quantity + quantity;
        const stock = this.calculateStockCounts( state.cart[ index ], quantity );
        if ( qty !== 0 && stock ) {
          state.cart[ index ].quantity = qty;
        }
        localStorage.setItem( 'cartItems', JSON.stringify( state.cart ) );
        return true;
      }
    } );
  }

  // Calculate Stock Counts
  calculateStockCounts( product, quantity ) {
    const qty = product.quantity + quantity;
    const stock = product.stock;
    if ( stock < qty || stock === 0 ) {
      this.toastrService.error( 'No puede agregar más elementos de los disponibles. En stock ' + stock + ' items.' );
      return false;
    }
    return true;
  }

  // Remove Cart items
  removeCartItem( product: Product ): any {
    const index = state.cart.indexOf( product );
    state.cart.splice( index, 1 );
    localStorage.setItem( 'cartItems', JSON.stringify( state.cart ) );
    return true;
  }

  // Total amount
  cartTotalAmount(): Observable<number> {
    return this.cartItems.pipe( map( ( product: Product[] ) => {
      return product.reduce( ( prev, curr: Product ) => {
        // let price = curr.price;
        // if ( curr.discount ) {
        //   price = curr.price - ( curr.price * curr.discount / 100 );
        // }
        // return ( prev + price * curr.quantity ) * this.Currency.price;
        return 0;
      }, 0 );
    } ) );
  }

  /*
   ---------------------------------------------
   ------------- Product Pagination  -----------
   ---------------------------------------------
 */
  getPager( totalItems: number, currentPage: number = 1, pageSize: number = 16 ) {
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
