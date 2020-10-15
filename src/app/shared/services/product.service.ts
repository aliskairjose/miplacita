import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { Product } from '../classes/product';
import { map } from 'rxjs/operators';
import { Category } from '../classes/category';
import { Response, Result } from '../classes/response';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from './storage.service';
import { Review } from '../classes/review';
import { VariableProduct } from '../classes/variable-product';

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

  Currency = { name: 'Dollar', currency: 'USD', price: 1 }; // Default Currency
  $product: Subject<Product> = new Subject<Product>();
  selectedProduct: Product;
  OpenCart = false;

  constructor(
    private http: HttpService,
    private storage: StorageService,
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

  /**
   * @description Obtiene la data del producto variable
   * @param id Id del producto base
   */
  producVariable( id: string ): Observable<any> {
    return this.http.get( `products/${id}/variable` ).pipe(
      map( response => {
        if ( response.success ) { return response.result[ 0 ]; }
      } )
    );
  }

  /**
   * @description Eliminado de producto por Id
   * @param id Id del producto a eliminar
   */
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


  /*
      ---------------------------------------------
      ---------------  Photos  --------------------
      ---------------------------------------------
  */
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
  deletePhoto( productId: string, photoId: string, ): Observable<any> {
    return this.http.delete( `products/${productId}/photo/${photoId}` );
  }

  /**
   * @description Coloca la foto como principal
   * @param productI Id del producto a la cual se colocara la imagen principal
   * @param photoId id de la foto que sera principal
   */
  setMainPhoto( productId: string, photoId: string ): Observable<any> {
    return this.http.put( `products/${productId}/photo/${photoId}` );
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
    this.toastrService.success( 'El producto se ha agregado a la lista de deseos.' );
    this.storage.setItem( 'wishlistItems', state.wishlist );
    return true;
  }

  // Remove Wishlist items
  public removeWishlistItem( product: Product ): any {
    const index = state.wishlist.indexOf( product );
    state.wishlist.splice( index, 1 );
    this.storage.setItem( 'wishlistItems', state.wishlist );
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
    this.toastrService.success( 'El producto ha sido agregado en comparar.' );
    this.storage.setItem( 'compareItems', state.compare );
    return true;
  }

  // Remove Compare items
  public removeCompareItem( product: Product ): any {
    const index = state.compare.indexOf( product );
    state.compare.splice( index, 1 );
    this.storage.setItem( 'compareItems', state.compare );
    return true;
  }

  /*
   ---------------------------------------------
   -------------  Variaciones ------------------
   ---------------------------------------------
 */

  /**
   * @description Agrega variacion a producto
   * @param data Data de variacion de producto
   */
  addVariableProduct( data: VariableProduct ): Observable<any> {
    return this.http.post( 'products/variable', data );
  }

  /**
   * @description Muestra las variaciones del producto
   * @param id Id del producto padre al que pertenece la variacion
   * @param type El tipo de variacion Color | Size
   */
  getVariableProduct( id: string, type: string ): Observable<any> {
    return this.http.get( `products/variable?store=${id}&type=${type}` );
  }

  /**
   * @description Elimina la variacion del producto
   * @param id Id de la variacion a eliminar
   */
  deleteVariableProduct( id: string ): Observable<any> {
    return this.http.delete( `products/variable/${id}` );
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
  addToCart( product: Product ): any {
    console.log( 'addCart' )
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
    this.storage.setItem( 'cartItems', state.cart );
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
        this.storage.setItem( 'cartItems', state.cart );
        return true;
      }
    } );
  }

  // Calculate Stock Counts
  private calculateStockCounts( product: Product, quantity: number ) {
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
    this.storage.setItem( 'cartItems', state.cart );
    return true;
  }

  emptyCartItem(): any {
    console.log( 'emptyCartItem' );

    state.cart = [];
    this.storage.setItem( 'cartItems', state.cart );
    // this.storage.removeItem('cartItems');
    return true;
  }


  // Total amount
  cartTotalAmount(): Observable<number> {
    return this.cartItems.pipe( map( ( product: Product[] ) => {
      return product.reduce( ( prev, curr: Product ) => {
        const price: any = curr.price;
        return ( prev + price * curr.quantity );
      }, 0 );
    } ) );
  }

  /*
    ---------------------------------------------
    -------------  Product Review  --------------
    ---------------------------------------------
  */

  /**
   * @description Agrega un nuevo review al produco
   * @param data Data del review del producto
   */
  addReview( data: Review ): Observable<Review> {
    return this.http.post( `reviews/create`, data ).pipe(
      map( result => {
        if ( result.success ) { return result.reviews; }
      } )
    );
  }

  productReviews( id: string ): Observable<Review[]> {
    return this.http.get( `reviews/product/${id}` ).pipe(
      map( ( response ) => {
        if ( response.success ) { return response.result; }
      } )
    );
  }

  /**
   * @description Calificacion promedio del prodcuto
   * @param id id del producto
   */
  productAverage( id: string ): Observable<any> {
    return this.http.get( `reviews/average/${id}` ).pipe(
      map( result => {
        if ( result.success ) { return result.reviews; }
      } )
    );
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
