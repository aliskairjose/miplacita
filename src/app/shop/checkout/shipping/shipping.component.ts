import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';
import { OrderService } from '../../../shared/services/order.service';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../shared/classes/user';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '../../../shared/services/shop.service';
import { ShipmentOption } from '../../../shared/classes/shipment-option';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Router } from '@angular/router';


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
export class ShippingComponent implements OnInit, OnDestroy {

  checkoutForm: FormGroup;
  submitted: boolean;
  products: Product[] = [];
  payPalConfig?: IPayPalConfig;
  payment = 'Stripe';
  amount: any;
  user: User = {};
  shippingAddress: ShippingAddress;
  shipmentOptions: ShipmentOption[] = [];
  autocompleteInput: string;


  @ViewChild( 'placesRef' ) placesRef: GooglePlaceDirective;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storage: StorageService,
    private shopService: ShopService,
    private orderService: OrderService,
    private toastrService: ToastrService,
    public productService: ProductService,
  ) {

    this.user = this.storage.getItem( 'user' );

    this.createForm();

    if ( this.user ) {
      const store = this.user.stores[ 0 ];
      const shippingAddress: ShippingAddress = this.storage.getItem( `shippingAddress${this.user._id}` );
      this.shopService.findShipmentOptionByShop( store._id ).subscribe( shipmentOptions => {
        this.shipmentOptions = [ ...shipmentOptions ];
      } );
      if ( shippingAddress && ( shippingAddress.userId === this.user._id ) ) {
        const response = confirm( 'Ya existe una dirección, ¿Desea usarla?' );
        ( response ) ? this.shippingAddress = shippingAddress : this.shippingAddress = {};
      }
    } else {
      this.toastrService.warning( 'Debe iniciar sesión' );
    }

  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.checkoutForm.controls; }

  ngOnInit(): void {
    this.productService.cartItems.subscribe( response => this.products = response );
    this.getTotal.subscribe( amount => this.amount = amount );
    this.initConfig();
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  createForm(): void {
    this.checkoutForm = this.fb.group( {
      firstname: [ this.shippingAddress ? this.shippingAddress.firstname : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      lastname: [ this.shippingAddress ? this.shippingAddress.lastname : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      phone: [ this.shippingAddress ? this.shippingAddress.phone : '', [ Validators.required, Validators.pattern( '[0-9]+' ) ] ],
      email: [ this.shippingAddress ? this.shippingAddress.email : '', [ Validators.required, Validators.email ] ],
      address: [ this.shippingAddress ? this.shippingAddress.address : '', [ Validators.required, Validators.maxLength( 50 ) ] ],
      // country: [ '', Validators.required ],
      // town: [ '', Validators.required ],
      // state: [ '', Validators.required ],
      // postalcode: [ '', Validators.required ]
    } );
  }

  checkout(): void {
    this.submitted = true;
    if ( this.checkoutForm.valid ) {
      const shippingAddress = { ...this.checkoutForm.value };
      shippingAddress.userId = this.user._id;
      this.storage.setItem( `shippingAddress${this.user._id}`, shippingAddress );
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
        this.orderService.createOrder( this.products, this.checkoutForm.value, token.id, this.amount );
      }
    } );
    handler.open( {
      name: 'Multikart',
      description: 'Online Fashion Store',
      amount: this.amount * 100
    } );
  }

  handleAddressChange( address: any ): void {
    console.log( address.formatted_address );
    this.checkoutForm.value.address = address.formatted_address;
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
        this.orderService.createOrder( this.products, this.checkoutForm.value, data.orderID, this.getTotal );
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

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

  }

}
