import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/classes/product';
import { environment } from '../../../environments/environment.prod';
import { Store } from '../../shared/classes/store';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe( products => { this.products = products; } );

    this.route.queryParams.subscribe( queryParams => {
      if ( Object.entries( queryParams ).length !== 0 ) {
        if ( queryParams.config ) {
          this.config = queryParams.config;
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
    this.products.splice( index, 1 );
    this.productService.removeCartItem( product );
  }

}
