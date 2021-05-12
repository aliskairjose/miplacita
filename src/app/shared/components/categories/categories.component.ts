import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Category } from '../../classes/category';

@Component( {
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: [ './categories.component.scss' ]
} )
export class CategoriesComponent implements OnInit, OnChanges {

  collapse = true;
  private _categories: Category[] = [];
  private index;
  private event: any;

  @Input() categories: Category[] = [];
  @Output() categoryFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
  ) { }
  ngOnChanges( changes: SimpleChanges ): void {
    console.log( {
      currentValue: changes.categories.currentValue,
      previousValue: changes.categories.previousValue,
      index: this.index
    } );
    const currentValue = changes.categories.currentValue;
    const previousValue = changes.categories.previousValue;
    if ( ( currentValue.length > previousValue.length ) && this.index === -1 ) {
      this.event.target.checked = false;
    }
  }

  ngOnInit(): void {
  }

  // Llena el la lista de tiendas
  get filterCategory() {
    let uniqueCategories = [];
    uniqueCategories = this.categories;
    return uniqueCategories;
  }

  appliedFilter( event ): void {
    this.event = event;
    this.index = this._categories.indexOf( event.target.value );  // checked and unchecked value

    if ( this.event.target.checked ) {
      this._categories.push( this.event.target.value );
    } else {
      this._categories.splice( this.index, 1 );
    }
    const categories = this._categories.length ? { category: this._categories.join( ',' ) } : { category: null };
    this.categoryFilter.emit( categories );
  }

}
