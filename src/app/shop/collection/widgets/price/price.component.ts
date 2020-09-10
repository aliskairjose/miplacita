import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Options } from 'ng5-slider';

@Component( {
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: [ './price.component.scss' ]
} )
export class PriceComponent implements OnInit {

  collapse = true;
  private _prices: any[] = [];

  @Input() prices: any[] = [];
  @Output() priceFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void { }

  // Llena el la lista de tiendas
  get filterPrice() {
    let uniquePrices = [];
    uniquePrices = this.prices;
    return uniquePrices;
  }

  appliedFilter( event ) {
    console.log( event )
    const index = this._prices.indexOf( event.target.value );  // checked and unchecked value

    if ( event.target.checked ) {
      this._prices.push( event.target.value );
    } else {
      this._prices.splice( index, 1 );
    }

    const prices = this._prices.length ? { price_order: this._prices.join( ',' ) } : { price_order: null };
    this.priceFilter.emit( prices );
  }

  checked( item ) {
    if ( this._prices.indexOf( item ) !== -1 ) {
      return true;
    }
  }

}
