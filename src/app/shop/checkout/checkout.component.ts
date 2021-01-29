import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPayPalConfig } from 'ngx-paypal';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';
import { OrderService } from '../../shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentComponent } from '../../shared/components/payment/payment.component';
import { Store } from '../../shared/classes/store';
import { AuthService } from '../../shared/services/auth.service';

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
  amount: number;
  shipmentPrice = 0;
  totalPrice = 0;
  referedAmount = 0;
  private _totalPrice: number;
  store: Store = {};
  itms = 0;
  isFirstShop = false;
  hasCoupon = false;
  couponAmount: number;
  newSubTotal: number;
  @ViewChild( 'payment' ) payment: PaymentComponent;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService,
    private route: ActivatedRoute,
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
    this.productService.cartItems.subscribe( response => { this.products = response; } );

  }

  ngOnInit(): void {
    const date = new Date();
    const shipment = JSON.parse( sessionStorage.order );

    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        const decod = window.atob( queryParams.config );
        this.store = JSON.parse( decod );
        if ( Object.entries( this.store ).length !== 0 && this.auth.getUserRol() === 'client' ) {
          this.orderService.orderList( 1, `user=${this.auth.getUserActive()._id}` ).subscribe( res => {
            if ( res.docs.length === 0 ) {
              this.isFirstShop = true;
            }
          } );
        }
      }
    } );


    shipment.cart.forEach( detail => {
      this.shipmentPrice += detail.shipment_price;
    } );

    this.subTotal.subscribe( amount => {
      this.amount = amount;
      this._totalPrice = this.totalPrice = amount + this.shipmentPrice + this.getItms;
    } );

  }

  get getItms(): number {
    this.products.forEach( ( product: Product ) => {
      this.itms += product.tax;
    } );
    return this.itms;
  }

  public get subTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  public get total(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  onSubmit(): void {
    this.submitted = true;
    const payment = [];
    let data: any = { valid: false, tdc: {} };
    data = this.payment.onSubmit();

    // Metodo de pago
    payment.push( { type: 'TDC', amount: this.totalPrice, info: data.tdc } );
    if ( this.referedAmount > 0 ) {
      payment.push( { type: 'refered', amount: this.referedAmount, info: { owner: data.tdc.owner } } );
    }

    const order = JSON.parse( sessionStorage.order );

    ( this.store._id ) ? order.type = 'store' : order.type = 'marketplace';

    order.payment = payment;

    if ( data.valid ) {
      this.orderService.createOrder( order ).subscribe( response => {
        if ( response.success ) {
          sessionStorage.removeItem( 'order' );
          this.productService.emptyCartItem();
          this.router.navigate( [ '/shop/checkout/success' ] );
        }
      } );
    }
  }

  // Saldo de referido
  getAmount( amount ): void {
    if ( !amount ) {
      this.totalPrice = this._totalPrice;
      this.referedAmount = 0;
      return;
    }
    this.totalPrice = this._totalPrice;
    this.referedAmount = amount;
    this.totalPrice = this.totalPrice - amount;
  }

  // Valida si el cupón es valido
  getSponsor( success: boolean ): void {

    // Se aplica el monto (porcentaje), como descuento
    if ( success ) {
      this.hasCoupon = success;
      this.couponAmount = ( this.amount * this.store.affiliate_program_amount ) / 100;
      this.newSubTotal = this.amount - this.couponAmount;
      this._totalPrice = this.totalPrice = this.newSubTotal + this.shipmentPrice + this.getItms;

      // this.totalPrice =
    }
  }

}
