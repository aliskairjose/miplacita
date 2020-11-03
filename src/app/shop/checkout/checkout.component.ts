import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPayPalConfig } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';
import { OrderService } from '../../shared/services/order.service';
import { Router } from '@angular/router';
import { PaymentComponent } from '../../shared/components/payment/payment.component';
import { StorageService } from '../../shared/services/storage.service';
import { ShopService } from '../../shared/services/shop.service';

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
  referedAmount = 0;
  private _totalPrice: number;

  @ViewChild( 'payment' ) payment: PaymentComponent;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private shopService: ShopService,
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

    shipment.cart.forEach( detail => {
      this.shipmentPrice += detail.shipment_price;
    } );
    this.productService.cartItems.subscribe( response => { this.products = response; } );

    this.shopService.storeObserver().subscribe( store => {
      if ( store ) {
        const products = this.products.filter( item => item.store._id === store._id );
        this.products = [ ...products ];
      }
    } );

    this.subTotal.subscribe( amount => {
      this.amount = amount;
      this._totalPrice = this.totalPrice = amount + this.shipmentPrice;
    } );


  }

  public get subTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  public get total(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  getAmount( amount: number ): void {
    if ( !amount ) {
      this.totalPrice = this._totalPrice;
      this.referedAmount = 0;
      return;
    }
    this.totalPrice = this._totalPrice;
    this.referedAmount = amount;
    this.totalPrice = this.totalPrice - amount;
  }

  onSubmit(): void {
    this.submitted = true;
    const order = JSON.parse( sessionStorage.order );

    if ( this.payment.onSubmit() ) {
      this.orderService.createOrder( order ).subscribe( response => {
        if ( response.success ) {
          sessionStorage.removeItem( 'order' );
          this.productService.emptyCartItem();
          this.router.navigate( [ '/shop/checkout/success' ] );
        }
      } );
    }
  }

}
