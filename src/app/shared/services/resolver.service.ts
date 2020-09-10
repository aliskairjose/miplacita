import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Product } from '../classes/product';
import { ProductService } from './product.service';
import { Result } from '../classes/response';

@Injectable( {
  providedIn: 'root'
} )
export class Resolver implements Resolve<Product> {

  public product: Product = {};

  constructor(
    private router: Router,
    public productService: ProductService
  ) { }

  // Resolver
  async resolve( route: ActivatedRouteSnapshot ): Promise<any> {
    await new Promise( resolve => setTimeout( resolve, 1000 ) );
    this.productService.productList( 1, `product=${route.params.slug}` ).subscribe( ( result: Result<Product> ) => {
      if ( !result.docs ) { // When product is empty redirect 404
        this.router.navigateByUrl( '/pages/404', { skipLocationChange: true } );
      } else {
        this.product = { ...result.docs[ 0 ] };
      }
    } );
    return this.product;
  }
}
