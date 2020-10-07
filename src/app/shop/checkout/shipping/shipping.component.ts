import { IPayPalConfig } from 'ngx-paypal';
import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../../../shared/classes/product';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';
import { ProductService } from '../../../shared/services/product.service';
import { ShopService } from '../../../shared/services/shop.service';
import { StorageService } from '../../../shared/services/storage.service';
import { UserService } from '../../../shared/services/user.service';


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

  constructor(
    private router: Router,
    private shopService: ShopService,
    public productService: ProductService,
  ) {

    this.productService.cartItems.subscribe( products => {
      ( products.length ) ? this._products = [ ...products ] : this.router.navigate( [ '/home' ] );
    } );

    this.getStoresId().then( ( shops ) => {
      for ( const shop of shops as any ) {
        const detail = { ...this.detail };
        detail.store = shop.id;
        const products = this._products.filter( value => value.store._id === shop.id );
        detail.products = products;
        detail.shipment_option = shop.shopOptions[ 0 ]._id;
        detail.shipment_price = shop.shopOptions[ 0 ].price;
        this.cart.push( detail );
      }
      this.shipmentOptions = shops;
      this.order.cart = this.cart;
      this.order.user = this.user._id;
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

    // this.submitted = true;
    // if ( this.checkoutForm.valid ) {
    //   const shippingAddress = { ...this.checkoutForm.value };
    //   this.order.address.address = this.checkoutForm.value.address;
    //   this.order.address.phone = this.checkoutForm.value.phone;
    //   this.order.address.location = [ this.latitude, this.longitude ];

    // se agrega id a la dirección para cuando se cargue desde storage comparar con el usuario activo
    // shippingAddress.userId = this.user._id;
    // this.storage.setItem( `shippingAddress${this.user._id}`, shippingAddress );
    // sessionStorage.setItem( 'order', JSON.stringify( this.order ) );
    // this.router.navigate( [ 'shop/checkout' ] );
    // }

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
      const index = uniqueStoreID.indexOf( product.store._id );
      if ( index === -1 ) {
        const shop: any = {};
        shop.id = product.store._id;
        shop.name = product.store.name;
        uniqueStore.push( shop );
        uniqueStoreID.push( product.store._id );
      }
    } );
    return uniqueStore;
  }

}
