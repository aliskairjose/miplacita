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

  collapse = true;
  private _categories: Category[] = [];

  @Input() categories: Category[] = [];
  @Output() categoryFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  // Llena el la lista de tiendas
  get filterCategory() {
    let uniqueCategories = [];
    uniqueCategories = this.categories;
    return uniqueCategories;
  }

  appliedFilter( event ): void {
    const index = this._categories.indexOf( event.target.value );  // checked and unchecked value

    if ( event.target.checked ) {
      this._categories.push( event.target.value );
    } else {
      this._categories.splice( index, 1 );
    }

    const categories = this._categories.length ? { category: this._categories.join(',') } : { category: null };
    this.categoryFilter.emit( categories );  }

  // check if the item are selected
  checked( item ) {
    const result = this._categories.filter( x => x._id === item );
    if ( result.length > 0 ) {
      return true;
    }
  }

}
