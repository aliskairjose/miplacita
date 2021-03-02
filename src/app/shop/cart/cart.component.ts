import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/classes/product';
import { ActivatedRoute } from '@angular/router';
import { Store } from '../../shared/classes/store';
import { AuthService } from '../../shared/services/auth.service';
import { STANDARD_IMAGE } from '../../shared/classes/global-constants';

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
  standardImage = STANDARD_IMAGE;
  storeFont = '';
  config = '';
  order = '';
  store: Store = {};

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    public productService: ProductService,
  ) {

  }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.productService.cartItems.subscribe( products => { this.products = products; } );
    this.order = window.btoa( sessionStorage.order );

    // tslint:disable-next-line: deprecation
    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        if ( queryParams.config ) {
          this.config = queryParams.config;
          const decod = window.atob( queryParams.config );
          this.store = JSON.parse( decod );
          if ( Object.entries( this.store ).length === 0 && sessionStorage.sessionStore ) {
            sessionStorage.removeItem( 'sessionStore' );
            setTimeout( (): void => {
              window.location.reload();
            }, 10 );
          }
        }
      }
    } );

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
