import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { Category } from '../../classes/category';

@Component( {
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: [ './categories.component.scss' ]
} )
export class CategoriesComponent implements OnInit {

  products: Product[] = [];
  collapse = true;

  @Input() categories: Category[] = [];
  @Output() categoryFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public productService: ProductService
  ) {}

  ngOnInit(): void {
  }

  appliedFilter( event ): void {
    console.log( event.target.value );
    this.categoryFilter.emit( { category: event.target.value } );
  }

  // check if the item are selected
  checked( item ) {
    // if ( this.categories.indexOf( item ) !== -1 ) {
    //   return true;
    // }
  }

  // get filterbyCategory() {
  //   const category = [...new Set(this.products.map(product => product.type))]
  //   return category
  // }

}
