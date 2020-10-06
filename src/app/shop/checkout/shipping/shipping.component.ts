import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { Product } from '../../../shared/classes/product';
import { User } from '../../../shared/classes/user';
import { AuthService } from '../../../shared/services/auth.service';
import { ProductService } from '../../../shared/services/product.service';
import { ShopService } from '../../../shared/services/shop.service';
import { StorageService } from '../../../shared/services/storage.service';

export interface ShippingAddress {
  name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  userId?: string;
}
@Component( {
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: [ './shipping.component.scss' ]
} )
export class ShippingComponent implements OnInit {

  checkoutForm: FormGroup;
  submitted: boolean;
  payPalConfig?: IPayPalConfig;
  payment = 'Stripe';
  amount: any;
  user: User = {};
  shippingAddress: ShippingAddress;
  shipmentOptions: any = [];
  autocompleteInput: string;
  latitude = 10.4683841;
  longitude = -66.9604066;
  zoom: number;
  address: string;
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
  options = {
    types: [],
    componentRestrictions: { country: 'PA' }
  };

  private geoCoder;
  private _products: Product[] = [];

  @ViewChild( 'placesRef' ) placesRef: GooglePlaceDirective;
  @ViewChild( 'placesRef' ) public searchElementRef: ElementRef;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private storage: StorageService,
    private shopService: ShopService,
    private mapsAPILoader: MapsAPILoader,
    private toastrService: ToastrService,
    public productService: ProductService,
  ) {

    this.productService.cartItems.subscribe( products => this._products = [ ...products ] );

    if ( this.auth.isAuthenticated() ) {
      this.hideMessage = true;
      this.user = this.storage.getItem( 'user' );

      const store = this.user.stores[ 0 ];
      const shippingAddress: ShippingAddress = this.storage.getItem( `shippingAddress${this.user._id}` );

      if ( shippingAddress && ( shippingAddress.userId === this.user._id ) ) {
        const response = confirm( 'Ya existe una dirección, ¿Desea usarla?' );
        ( response ) ? this.shippingAddress = shippingAddress : this.shippingAddress = {};
      }
    }

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
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.checkoutForm.controls; }

  ngOnInit(): void {
    // this.productService.cartItems.subscribe( response => this.products = response );
    this.getTotal.subscribe( amount => this.amount = amount );
    this.initConfig();
    this.setCurrentLocation();
    this.mapsAPILoader.load().then( () => {
      this.setCurrentLocation();
      // tslint:disable-next-line: new-parens
      this.geoCoder = new google.maps.Geocoder;

      const autocomplete = new google.maps.places.Autocomplete( this.searchElementRef.nativeElement );
      autocomplete.addListener( 'place_changed', () => {
        this.ngZone.run( () => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if ( place.geometry === undefined || place.geometry === null ) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        } );
      } );
    } );
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  createForm(): void {

    this.checkoutForm = this.fb.group( {
      name: [ this.shippingAddress ? this.shippingAddress.name : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      last_name: [ this.shippingAddress ? this.shippingAddress.last_name : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      phone: [ this.shippingAddress ? this.shippingAddress.phone : '', [ Validators.required, Validators.pattern( '[0-9]+' ) ] ],
      email: [ this.shippingAddress ? this.shippingAddress.email : '', [ Validators.required, Validators.email ] ],
      address: [ this.shippingAddress ? this.shippingAddress.address : '', [ Validators.required, Validators.maxLength( 50 ) ] ],
      reference: [ '' ]
    } );
  }

  checkout(): void {

    this.submitted = true;
    if ( this.checkoutForm.valid ) {
      const shippingAddress = { ...this.checkoutForm.value };
      this.order.address.address = this.checkoutForm.value.address;
      this.order.address.phone = this.checkoutForm.value.phone;
      this.order.address.location = [ this.latitude, this.longitude ];

      // se agrega id a la dirección para cuando se cargue desde storage comparar con el usuario activo
      shippingAddress.userId = this.user._id;
      this.storage.setItem( `shippingAddress${this.user._id}`, shippingAddress );
      sessionStorage.setItem( 'order', JSON.stringify( this.order ) );
      this.router.navigate( [ 'shop/checkout' ] );
    }

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

  // Stripe Payment Gateway
  stripeCheckout() {
    const handler = ( window as any ).StripeCheckout.configure( {
      key: environment.stripe_token, // publishble key
      locale: 'auto',
      token: ( token: any ) => {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        // this.orderService.createOrder( this.products, this.checkoutForm.value, token.id, this.amount );
      }
    } );
    handler.open( {
      name: 'Multikart',
      description: 'Online Fashion Store',
      amount: this.amount * 100
    } );
  }

  handleAddressChange( address: any ): void {
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.checkoutForm.value.address = address.formatted_address;
  }

  markerDragEnd( $event ) {
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();

    this.getAddress( this.latitude, this.longitude );
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: this.productService.Currency.currency,
      clientId: environment.paypal_token,
      // tslint:disable-next-line: no-angle-bracket-type-assertion
      createOrderOnClient: ( data ) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [ {
          amount: {
            currency_code: this.productService.Currency.currency,
            value: this.amount,
            breakdown: {
              item_total: {
                currency_code: this.productService.Currency.currency,
                value: this.amount
              }
            }
          }
        } ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        size: 'small', // small | medium | large | responsive
        shape: 'rect', // pill | rect
      },
      onApprove: ( data, actions ) => {
        // this.orderService.createOrder( this.products, this.checkoutForm.value, data.orderID, this.getTotal );
        console.log( 'onApprove - transaction was approved, but not authorized', data, actions );
        actions.order.get().then( cart => {
          console.log( 'onApprove - you can get full order cart inside onApprove: ', cart );
        } );
      },
      onClientAuthorization: ( data ) => {
        console.log( 'onClientAuthorization - you should probably inform your server about completed transaction at this point', data );
      },
      onCancel: ( data, actions ) => {
        console.log( 'OnCancel', data, actions );
      },
      onError: err => {
        console.log( 'OnError', err );
      },
      onClick: ( data, actions ) => {
        console.log( 'onClick', data, actions );
      }
    };
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ( 'geolocation' in navigator ) {
      navigator.geolocation.getCurrentPosition( ( position ) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      } );
    }
  }

  private getAddress( latitude, longitude ) {
    this.geoCoder.geocode( { location: { lat: latitude, lng: longitude } }, ( results, status ) => {
      if ( status === 'OK' ) {
        if ( results[ 0 ] ) {
          this.zoom = 12;
          this.address = results[ 0 ].formatted_address;
          this.checkoutForm.value.address = this.address;
        } else {
          this.toastrService.warning( 'No results found' );
        }
      } else {
        this.toastrService.warning( `Geocoder failed due to: ${status}` );
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
