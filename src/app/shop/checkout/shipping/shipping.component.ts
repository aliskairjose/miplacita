import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../shared/classes/user';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '../../../shared/services/shop.service';
import { ShipmentOption } from '../../../shared/classes/shipment-option';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { AuthService } from '../../../shared/services/auth.service';
import { log } from 'console';



export interface ShippingAddress {
  firstname?: string;
  lastname?: string;
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
  shipmentOptionsForm: FormGroup;
  submitted: boolean;
  payPalConfig?: IPayPalConfig;
  payment = 'Stripe';
  amount: any;
  user: User = {};
  shippingAddress: ShippingAddress;
  shipmentOptions: any = [];
  autocompleteInput: string;
  title = 'My first AGM project';
  latitude = 10.4683841;
  longitude = -66.9604066;
  zoom: number;
  address: string;
  hideMessage = false;
  selectedOption = '';
  order = {
    products: [],
    store: '',
    shipment_option: '',
    shipment_price: 0,
    address: {
      address: '',
      landMark: '',
      location: [],
      phone: ''
    }
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
      this.shipmentOptions = shops;
    } );
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.checkoutForm.controls; }
  get o() { return this.shipmentOptionsForm.controls; }

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

    this.shipmentOptionsForm = this.fb.group( {
      shipment_option: [ '', [ Validators.required ] ],
    } );

    this.checkoutForm = this.fb.group( {
      firstname: [ this.shippingAddress ? this.shippingAddress.firstname : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      lastname: [ this.shippingAddress ? this.shippingAddress.lastname : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      phone: [ this.shippingAddress ? this.shippingAddress.phone : '', [ Validators.required, Validators.pattern( '[0-9]+' ) ] ],
      email: [ this.shippingAddress ? this.shippingAddress.email : '', [ Validators.required, Validators.email ] ],
      address: [ this.shippingAddress ? this.shippingAddress.address : '', [ Validators.required, Validators.maxLength( 50 ) ] ],
      reference: [ '' ],
      // country: [ '', Validators.required ],
      // town: [ '', Validators.required ],
      // state: [ '', Validators.required ],
      // postalcode: [ '', Validators.required ]
    } );
  }

  checkout(): void {

    this.order.address.address = this.checkoutForm.value.address;
    this.order.address.phone = this.checkoutForm.value.phone;
    this.order.shipment_option = this.shipmentOptionsForm.get( 'shipment_option' ).value;
    const ship = this.shipmentOptions.filter( val => val._id === this.order.shipment_option );
    this.order.shipment_price = ship[ 0 ].price;

    this.submitted = true;
    if ( this.checkoutForm.valid ) {
      const shippingAddress = { ...this.checkoutForm.value };
      shippingAddress.userId = this.user._id;
      this.storage.setItem( `shippingAddress${this.user._id}`, shippingAddress );
      sessionStorage.setItem( 'order', JSON.stringify( this.order ) );
      this.router.navigate( [ 'shop/checkout' ] );
    }

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
        actions.order.get().then( details => {
          console.log( 'onApprove - you can get full order details inside onApprove: ', details );
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
    return new Promise( resolve => {
      const uniqueStore = [];

      this._products.filter( async ( product ) => {
        const index = uniqueStore.indexOf( product.store._id );
        if ( index === -1 ) {
          const shop: any = {};
          shop.id = product.store._id;
          shop.name = product.store.name;
          const val = await this.getOptions( shop.id );
          shop.shopOptions = val;

          uniqueStore.push( shop );
        }
      } );
      resolve( uniqueStore );
    } );
  }

  private getOptions( id: string ) {
    return new Promise( resolve => {
      this.shopService.findShipmentOptionByShop( id ).subscribe( shipmentOptions => {
        resolve( shipmentOptions );
      } );
    } );
  }

}
