import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/classes/product';
import { environment } from '../../../environments/environment.prod';
import { ActivatedRoute } from '@angular/router';
import { Store } from '../../shared/classes/store';
import { AuthService } from '../../shared/services/auth.service';

const state = {
  sessionStore: JSON.parse( sessionStorage.sessionStore || null ),
};

@Component( {
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: [ './cart.component.scss' ]
} )
export class CartComponent implements OnInit {

  products: Product[] = [];
  standardImage = environment.standardImage;
  storeFont = '';
  config = '';
  showReferredDiscount: boolean;
  payDiscount = false;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    public productService: ProductService,
  ) {

  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe( products => { this.products = products; } );

    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        if ( queryParams.config ) {
          this.config = queryParams.config;
          const decod = window.atob( queryParams.config );
          const store: Store = JSON.parse( decod );
          if ( Object.entries( store ).length === 0 && sessionStorage.sessionStore ) {
            sessionStorage.removeItem( 'sessionStore' );
            setTimeout( (): void => {
              window.location.reload();
            }, 10 );
          }
          this.showReferredDiscount = Object.entries( store ).length !== 0 && this.auth.getUserRol() === 'client';
        }
      }
    } );

  }

  onChange( event: boolean ): void {
    this.payDiscount = event;
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Increament
  increment( product, qty = 1 ) {
    this.productService.updateCartQuantity( product, qty );
  }

  // Decrement
  decrement( product: Product, qty = -1 ) {
    this.productService.updateCartQuantity( product, qty );
  }

  removeItem( product: Product ) {
    const index = this.products.indexOf( product );
    // this.products.splice( index, 1 );
    this.productService.removeCartItem( product );
  }

}
