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
import { StorageService } from '../../shared/services/storage.service';

const state = {
  user: JSON.parse( localStorage.getItem( 'mp_user' ) || null )
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
  amount: number;
  totalPrice = 0;
  referedAmount = 0;
  store: Store = {};
  itms = 0;
  isFirstShop = false;
  hasCoupon = false;
  couponAmount: number;
  newSubTotal: number;

  private _order: any;
  private _shipmentPrice = 0;

  @ViewChild( 'payment' ) payment: PaymentComponent;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService,
    private route: ActivatedRoute,
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

    this.productService.cartItems.subscribe( response => { this.products = response; } );

  }

  ngOnInit(): void {
    const date = new Date();

    this.store = this.storage.getItem( 'isStore' );
    this._order = this.storage.getItem( 'order' );
    if ( Object.entries( this.store ).length !== 0 && this.auth.getUserRol() === 'client' ) {
      this.orderService.orderList( 1, `user=${this.auth.getUserActive()._id}` ).subscribe( res => {
        if ( res.docs.length === 0 ) {
          this.isFirstShop = true;
        }
      } );
    }

    this.subTotal.subscribe( amount => {
      this.amount = amount;
      this.totalPrice = amount + this._shipmentPrice + this.getItms;
    } );

  }

  get shipment(): number {
    this._shipmentPrice = 0;
    this._order.cart.forEach( detail => {
      this._shipmentPrice += detail.shipment_price;
    } );
    return this._shipmentPrice;
  }

  get getItms(): number {
    this.itms = 0;
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
    payment.push( { type: 'TDC', amount: ( ( this.totalPrice + this.shipment ) - this.referedAmount ), info: data.tdc } );
    if ( this.referedAmount > 0 ) {
      payment.push( { type: 'refered', amount: this.referedAmount, info: { owner: data.tdc.owner } } );
    }

    const order = this.storage.getItem( 'order' );

    ( this.store ) ? order.type = 'store' : order.type = 'marketplace';

    order.payment = payment;

    if ( data.valid ) {
      this.orderService.createOrder( order ).subscribe( response => {
        if ( response.success ) {
          this.storage.setItem( 'mp-store-shop', this.store );
          this.storage.removeItem( 'order' );
          this.productService.emptyCartItem();
          this.router.navigate( [ '/shop/checkout/success' ] );
        }
      } );
    }
  }

  // Saldo de referido
  getAmount( amount ): void {
    if ( !amount ) {
      this.referedAmount = 0;
      return;
    }
    this.referedAmount = amount;
  }

  // Valida si el cupón es valido
  getSponsor( success: boolean ): void {
    // Se aplica el monto (porcentaje), como descuento
    if ( success ) {
      this.hasCoupon = success;
      this.couponAmount = ( this.amount * this.store.affiliate_program_amount ) / 100;
      this.newSubTotal = this.amount - this.couponAmount;
      this.totalPrice = ( this.newSubTotal + this._shipmentPrice + this.getItms );
    }
  }

}
