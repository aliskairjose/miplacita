import { Component, OnInit, ViewChild } from '@angular/core';
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
import { StorageService } from '../../shared/services/storage.service';
import { timeStamp, log } from 'console';
import { PaymentComponent } from '../../shared/components/payment/payment.component';

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
  products: Product[] = [];
  submitted: boolean;
  payPalConfig?: IPayPalConfig;
  // payment = 'Stripe';
  amount: any;
  shipmentPrice = 0;
  totalPrice = 0;

  @ViewChild( 'payment' ) payment: PaymentComponent;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private storage: StorageService,
    private orderService: OrderService,
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
  }

  ngOnInit(): void {
    const date = new Date();
    const shipment = JSON.parse( sessionStorage.order );

    this.shipmentPrice = shipment.shipment_price;
    this.productService.cartItems.subscribe( response => this.products = response );

    this.subTotal.subscribe( amount => {
      this.amount = amount;
      this.totalPrice = amount + this.shipmentPrice;
    } );

    // this.initConfig();

  }

  public get subTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  public get total(): Observable<number> {
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
    this.submitted = true;
    const order = JSON.parse( sessionStorage.order );
    order.products = this.products;
    order.store = this.products[ 0 ].store._id;
    order.user = state.user._id;
    if ( this.payment.onSubmit() ) {
      this.orderService.createOrder( order ).subscribe( response => {
        if ( response.success ) {
          this.router.navigate( [ '/shop/checkout/success', response.order._id ] );
        }
      } );
    }

  }

  // Paypal Payment Gateway
  // private initConfig(): void {
  //   this.payPalConfig = {
  //     currency: this.productService.Currency.currency,
  //     clientId: environment.paypal_token,
  //     createOrderOnClient: ( data ) => <ICreateOrderRequest> {
  //       intent: 'CAPTURE',
  //       purchase_units: [ {
  //         amount: {
  //           currency_code: this.productService.Currency.currency,
  //           value: this.amount,
  //           breakdown: {
  //             item_total: {
  //               currency_code: this.productService.Currency.currency,
  //               value: this.amount
  //             }
  //           }
  //         }
  //       } ]
  //     },
  //     advanced: {
  //       commit: 'true'
  //     },
  //     style: {
  //       label: 'paypal',
  //       size: 'small', // small | medium | large | responsive
  //       shape: 'rect', // pill | rect
  //     },
  //     onApprove: ( data, actions ) => {
  //       // this.orderService.createOrder( this.products, this.checkoutForm.value, data.orderID, this.getTotal );
  //       console.log( 'onApprove - transaction was approved, but not authorized', data, actions );
  //       actions.order.get().then( details => {
  //         console.log( 'onApprove - you can get full order details inside onApprove: ', details );
  //       } );
  //     },
  //     onClientAuthorization: ( data ) => {
  //       console.log( 'onClientAuthorization - you should probably inform your server about completed transaction at this point', data );
  //     },
  //     onCancel: ( data, actions ) => {
  //       console.log( 'OnCancel', data, actions );
  //     },
  //     onError: err => {
  //       console.log( 'OnError', err );
  //     },
  //     onClick: ( data, actions ) => {
  //       console.log( 'onClick', data, actions );
  //     }
  //   };
  // }

}
