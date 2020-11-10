import { IPayPalConfig } from 'ngx-paypal';
import { Observable } from 'rxjs';

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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
  private _products: Product[] = [];

  @ViewChild( 'address' ) address: AddressComponent;

  constructor(
    private router: Router,
    private auth: AuthService,
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
      if ( store ) {
        const products = this._products.filter( item => item.store._id === store._id );
        this._products = [ ...products ];
      }
    } );

    if ( sessionStorage.sessionStore ) {
      const store: Store = JSON.parse( sessionStorage.sessionStore );
    }

    this.getStoresId().then( ( shops ) => {
      for ( const shop of shops as any ) {
        const detail = { ...this.detail };
        detail.store = shop.id;
        const products = this._products.filter( value => {
          if ( ( value.type === 'principal' ) && ( value.store._id === shop.id ) ) {
            return value;
          }
          if ( ( value.type === 'variable' ) && ( value.store === shop.id ) ) {
            return value;
          }
        } );
        detail.products = products;
        detail.shipment_option = shop.shopOptions[ 0 ]?._id;
        detail.shipment_price = shop.shopOptions[ 0 ]?.price;
        this.cart.push( detail );
      }
      this.shipmentOptions = shops;
      this.order.cart = this.cart;

      if ( this.user ) {
        this.order.user = this.user._id;
      }
      // Usuario invitado
      if ( !this.user ) {
        this.userService.userInvited().subscribe( response => {
          if ( response.success ) {
            this.storage.setItem( 'token', response.token );
            this.order.user = response.user._id;
          }
        } );
      }

    } );
  }

  ngOnInit(): void {
    // this.productService.cartItems.subscribe( response => this.products = response );
    this.getTotal.subscribe( amount => this.amount = amount );
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

    sessionStorage.setItem( 'order', JSON.stringify( this.order ) );
    this.router.navigate( [ 'shop/checkout' ] );
  }

  selectOption( shopId: string, optionId: string ): void {

    const shopOptions = [];

    // Obtenemos un array con todas las opciones de envío en pantalla
    for ( const i of this.shipmentOptions ) {
      shopOptions.push( ...i.shopOptions );
    }

    // Obtenemos la información de la opción de envíp seleccionada
    const shipOption = shopOptions.filter( val => val._id === optionId );

    this.order.cart.map( res => {
      if ( res.store === shopId ) {
        res.shipment_option = optionId;
        res.shipment_price = shipOption[ 0 ].price;
      }
    } );

  }

  private async getStoresId() {
    return await this.filterByStoreID();
  }

  /**
   * @description Retorna un array de id de tiendas unicos
   */
  private filterByStoreID() {
    return new Promise( async ( resolve ) => {
      const shops = [];
      const val = this.getUniqueStoreId();

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

  private getUniqueStoreId() {

    const uniqueStore = [];
    const uniqueStoreID = [];
    this._products.filter( ( product: Product ) => {
      let index = 0;

      if ( product.type === 'principal' ) { index = uniqueStoreID.indexOf( product.store._id ); }
      if ( product.type === 'variable' ) { index = uniqueStoreID.indexOf( product.store ); }

      if ( index === -1 ) {
        const shop: any = {};
        if ( product.type === 'principal' ) { shop.id = product.store._id; }
        if ( product.type === 'variable' ) { shop.id = product.store; }
        shop.name = product.store.name;
        uniqueStore.push( shop );
        uniqueStoreID.push( product.store._id );
      }
    } );
    return uniqueStore;
  }


}
