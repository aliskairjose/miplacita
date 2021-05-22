import { IPayPalConfig } from 'ngx-paypal';
import { Observable, from } from 'rxjs';

import { Component, OnInit, ViewChild, Pipe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Product } from '../../../shared/classes/product';
import { User } from '../../../shared/classes/user';
import { ProductService } from '../../../shared/services/product.service';
import { ShopService } from '../../../shared/services/shop.service';
import { AddressComponent } from '../../../shared/components/address/address.component';
import { UserService } from '../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Store } from 'src/app/shared/classes/store';
import { distinct, pluck } from 'rxjs/operators';


@Component( {
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: [ './shipping.component.scss' ]
} )
export class ShippingComponent implements OnInit {

  payPalConfig?: IPayPalConfig;
  payment = 'Stripe';
  amount: any;
  user: User = {};
  shipmentOptions: any = [];
  hideMessage = false;
  selectedOption = '';
  order = {
    cart: [],
    user: '',
    address: {
      address: '',
      name: '',
      last_name: '',
      email: '',
      landMark: '',
      location: [],
      phone: ''
    }
  };
  cart = [];
  detail = {
    products: [],
    store: '',
    shipment_option: '',
    shipment_price: 0,
  };
  isDisabled = false;
  store: Store = {};

  private _config: any = {};
  private _products: Product[] = [];

  @ViewChild( 'address' ) address: AddressComponent;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private storage: StorageService,
    private userService: UserService,
    private shopService: ShopService,
    public productService: ProductService,
  ) {
    this.user = this.auth.getUserActive();
    this.productService.cartItems.subscribe( products => {
      ( products.length ) ? this._products = [ ...products ] : this.router.navigate( [ '/home' ] );
    } );

    this.shopService.storeObserver().subscribe( store => {
      console.log( store );
      if ( store ) {
        this._products = this._products.filter( item => item.store._id === store._id );
      }
    } );

    if ( this.storage.getItem( 'isStore' ) ) {
      const store: Store = this.storage.getItem( 'isStore' );
    }

    // Obtiene la lista de opciones de envio de cada tienda
    this.getShipmentsOptions();

  }

  private async getShipmentsOptions() {
    const shops = await this.filterByStoreID();
    for ( const shop of shops as any ) {
      if ( shop.shopOptions.length === 0 ) { this.isDisabled = true; }
      const detail = { ...this.detail };
      detail.store = shop.id;
      const products = this._products.filter( p => p.store._id === shop.id );
      detail.products = products;
      detail.shipment_option = shop.shopOptions[ 0 ]?._id;
      detail.shipment_price = shop.shopOptions[ 0 ]?.price;
      this.cart.push( detail );
    }

    this.shipmentOptions = shops;
    this.order.cart = [ ...this.cart ];

    if ( this.user ) {
      this.order.user = this.user._id;
    }

    // Usuario invitado
    if ( !this.user ) {
      this.userService.userInvited().subscribe( response => {
        if ( response.success ) {
          this.storage.setItem( 'mp_token', response.token );
          this.order.user = response.user._id;
        }
      } );
    }
  }

  ngOnInit(): void {
    this.getTotal.subscribe( amount => this.amount = amount );
    this.store = this.storage.getItem( 'isStore' );
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  checkout(): void {
    const data = this.address.onSubmit();
    if ( data?.saveAddress ) {
      if ( Object.keys( data?.shippingAddress ).length !== 0 && data.addressExist ) {
        // Actualiza la dirección
        this.userService.updateUserAddress( this.user._id, data.shippingAddress ).subscribe( response => {
          if ( response.success ) {
            this.toastr.info( response.message[ 0 ] );
            this.makeOrderData( data.shippingAddress );
          }
        } );
      }
      if ( Object.keys( data?.shippingAddress ).length !== 0 && !data.addressExist ) {
        // Registra nueva dirección
        this.userService.addUserAddress( this.user._id, data.shippingAddress ).subscribe( response => {
          if ( response.success ) {
            this.toastr.info( response.message[ 0 ] );
            this.makeOrderData( data.shippingAddress );
          }
        } );
      }
    } else {
      // Continua sin guardar ni actualizar direccón
      this.makeOrderData( data.shippingAddress );
    }
  }


  private makeOrderData( shippingAddress ): void {
    this.order.address.address = shippingAddress.address;
    this.order.address.phone = shippingAddress.phone;
    this.order.address.location = shippingAddress.coord;
    this.order.address.name = shippingAddress.name;
    this.order.address.last_name = shippingAddress.last_name;
    this.order.address.email = shippingAddress.email;

    this.storage.setItem( 'order', this.order );
    this.router.navigate( [ 'shop/checkout' ] );
  }

  selectOption( shopId: string, optionId: string ): void {
    const shopOptions = [];

    // Obtenemos un array con todas las opciones de envío en pantalla
    for ( const i of this.shipmentOptions ) { shopOptions.push( ...i.shopOptions ); }

    // Obtenemos la información de la opción de envío seleccionada
    const _shipOption = shopOptions.find( val => val._id === optionId );
    this.order.cart.map( res => {
      if ( res.store === shopId ) {
        res.shipment_option = optionId;
        res.shipment_price = _shipOption.price;
      }
    } );
  }

  /**
   * @description Retorna un array de id de tiendas unicos
   */
  private filterByStoreID() {
    return new Promise( async ( resolve ) => {
      const shops = [];
      const val = await this.getUniqueStoreId();
      for ( const v of val ) {
        const options = await this.getOptions( v.id );
        v.shopOptions = options;
        shops.push( v );
      }
      resolve( shops );
    } );
  }

  private getOptions( id: string ) {
    return new Promise( resolve => {
      this.shopService.findShipmentOptionByShop( id ).subscribe( shipmentOptions => {
        resolve( shipmentOptions );
      } );
    } );
  }

  private getUniqueStoreId(): Promise<any[]> {
    return new Promise<any[]>( resolve => {
      const stores = [];
      const uniqueStores = [];
      const products = [ ... this._products ];

      // Seleccion de objeto store de producto principal
      const storesProduct = from( products ).pipe( pluck( 'store' ) );

      // Llenado de array store con id y name
      storesProduct.subscribe( _store => stores.push( { id: _store._id, name: _store.name } ) );

      // Array de tiendas sin duplicado
      from( stores ).pipe( distinct( s => s.id ) ).subscribe( _s => uniqueStores.push( _s ) );

      resolve( uniqueStores );

    } );

  }

}
