import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/classes/product';

@Component( {
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: [ './cart.component.scss' ]
} )
export class CartComponent implements OnInit {

  public products: Product[] = [];

  constructor(
    public productService: ProductService
  ) {

  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe( products => this.products = [ ...products ] );
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

  public removeItem( product: Product ) {
    this.productService.removeCartItem( product );
  }

}
