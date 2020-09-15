import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
// import { Product } from '../../shared/classes/tm.product';
import { Product } from '../../shared/classes/product';
// import { ProductService } from '../../shared/services/tm.product.service';
import { ProductService } from '../../shared/services/product.service';
import { OrderService } from '../../shared/services/order.service';
import { Router } from '@angular/router';

const state = {
  user: JSON.parse( localStorage.getItem( 'user' ) || null )
};

@Component( {
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: [ './checkout.component.scss' ]
} )
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  paymentForm: FormGroup;
  products: Product[] = [];
  submitted: boolean;
  payPalConfig?: IPayPalConfig;
  payment = 'Stripe';
  amount: any;
  months = [ { value: 1, name: 'Enero' },
  { value: 2, name: 'Febreo' },
  { value: 3, name: 'Marzo' },
  { value: 4, name: 'Abril' },
  { value: 5, name: 'Mayo' },
  { value: 6, name: 'Junio' },
  { value: 7, name: 'Julio' },
  { value: 8, name: 'Agosto' },
  { value: 9, name: 'Septiembre' },
  { value: 10, name: 'Octubre' },
  { value: 11, name: 'Noviembre' },
  { value: 12, name: 'Diciembre' } ];
  years = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public productService: ProductService,
    private orderService: OrderService
  ) {
    this.paymentForm = this.fb.group( {
      owner: [ '', [ Validators.required, Validators.pattern( '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' ) ] ],
      cvv: [ '', [ Validators.required, Validators.pattern( '[0-9]+' ) ] ],
      cardnumber: [ '', [ Validators.required ] ],
    } );

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
  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe( response => this.products = response );
    this.getTotal.subscribe( amount => this.amount = amount );
    this.initConfig();
    const date = new Date();
    this.years.push( date.getFullYear() );
    for ( let i = 0; i < 12; i++ ) {
      date.setMonth( date.getMonth() + 12 );
      this.years.push( date.getFullYear() );
    }
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.paymentForm.controls; }


  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Stripe Payment Gateway
  stripeCheckout() {
    const handler = ( <any> window ).StripeCheckout.configure( {
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

  onSubmit(): void {
    console.log(this.paymentForm);
    
    this.submitted = true;
    const order = JSON.parse( sessionStorage.order );
    order.products = this.products;
    order.store = this.products[ 0 ].store._id;
    order.user = state.user._id;
    if ( this.paymentForm.valid ) {
      this.orderService.createOrder( order ).subscribe( response => {
        if ( response.success ) {
          this.router.navigate( [ '/shop/checkout/success', response.order._id ] );
        }
      } );
    }

  }

  // Paypal Payment Gateway
  private initConfig(): void {
    this.payPalConfig = {
      currency: this.productService.Currency.currency,
      clientId: environment.paypal_token,
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
