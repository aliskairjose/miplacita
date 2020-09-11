import { Component, OnInit } from '@angular/core';
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

@Component( {
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: [ './shipping.component.scss' ]
} )
export class ShippingComponent implements OnInit {

  checkoutForm: FormGroup;
  products: Product[] = [];
  payPalConfig?: IPayPalConfig;
  payment = 'Stripe';
  amount: any;
  user: User;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private orderService: OrderService,
    private toastrService: ToastrService,
    public productService: ProductService,
  ) {
    this.checkoutForm = this.fb.group( {
      firstname: [ '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      lastname: [ '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      phone: [ '', [ Validators.required, Validators.pattern( '[0-9]+' ) ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      address: [ '', [ Validators.required, Validators.maxLength( 50 ) ] ],
      country: [ '', Validators.required ],
      town: [ '', Validators.required ],
      state: [ '', Validators.required ],
      postalcode: [ '', Validators.required ]
    } );

    this.user = this.storage.getItem( 'user' );

    if ( !this.user ) { this.toastrService.warning( 'Debe iniciar sesión' ); }

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

}
