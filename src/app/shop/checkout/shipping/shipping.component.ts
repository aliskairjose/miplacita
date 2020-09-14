import { Component, OnInit, OnDestroy } from '@angular/core';
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

const state = {
  shippingAddress: JSON.parse( localStorage.shippingAddress || '{}' ),
  user: JSON.parse( localStorage.user || null )
};

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
  products: Product[] = [];
  payPalConfig?: IPayPalConfig;
  payment = 'Stripe';
  amount: any;
  user: User = {};
  shippingAddress: ShippingAddress;
  shipmentOptions: ShipmentOption[] = [];

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private shopService: ShopService,
    private orderService: OrderService,
    private toastrService: ToastrService,
    public productService: ProductService,
  ) {

    if ( Object.keys( state.shippingAddress ).length !== 0 && ( state.shippingAddress._id === state.user._id ) ) {
      const response = confirm( 'Ya existe una dirección, ¿Desea usarla?' );
      if ( !response ) { state.shippingAddress = null; }
    }

    const store = state.user.stores[ 0 ];

    this.shopService.findShipmentOptionByShop( store._id ).subscribe( shipmentOptions => {
      this.shipmentOptions = [ ...shipmentOptions ];
    } );

    if ( !state.user ) { this.toastrService.warning( 'Debe iniciar sesión' ); }

    this.checkoutForm = this.fb.group( {
      firstname: [ state.shippingAddress ? state.shippingAddress.firstname : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      lastname: [ state.shippingAddress ? state.shippingAddress.lastname : '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      phone: [ state.shippingAddress ? state.shippingAddress.phone : '', [ Validators.required, Validators.pattern( '[0-9]+' ) ] ],
      email: [ state.shippingAddress ? state.shippingAddress.email : '', [ Validators.required, Validators.email ] ],
      address: [ state.shippingAddress ? state.shippingAddress.address : '', [ Validators.required, Validators.maxLength( 50 ) ] ],
      country: [ '', Validators.required ],
      town: [ '', Validators.required ],
      state: [ '', Validators.required ],
      postalcode: [ '', Validators.required ]
    } );

  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe( response => this.products = response );
    this.getTotal.subscribe( amount => this.amount = amount );
    this.initConfig();
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
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
    const shippingAddress = { ...this.checkoutForm.value };
    shippingAddress._id = state.user._id;

    this.storage.setItem( 'shippingAddress', shippingAddress );
  }

}
