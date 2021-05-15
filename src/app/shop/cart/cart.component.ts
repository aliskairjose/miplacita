import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/classes/product';
import { ActivatedRoute } from '@angular/router';
import { Store } from '../../shared/classes/store';
import { AuthService } from '../../shared/services/auth.service';
import { STANDARD_IMAGE } from '../../shared/classes/global-constants';

const state = {
  isStore: JSON.parse( localStorage.isStore || null ),
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
  order = '';
  store: Store = {};

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    public productService: ProductService,
  ) {

  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe( products => { this.products = products; } );
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Increament
  increment( product: Product, qty = 1 ) {
    if ( product.quantity === product.stock ) { return; }
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
