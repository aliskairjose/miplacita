import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/tm.product.service';

@Component( {
  selector: 'app-product-tabs',
  templateUrl: './product-tabs.component.html',
  styleUrls: [ './product-tabs.component.scss' ]
} )
export class ProductTabsComponent implements OnInit {

  public products: Product[] = [];

  constructor( public productService: ProductService ) {
    // tslint:disable-next-line: deprecation
    this.productService.getProducts.subscribe( response => this.products = response );
  }

  ngOnInit(): void {
  }

}
