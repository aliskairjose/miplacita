import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component( {
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: [ './price.component.scss' ]
} )
export class PriceComponent implements OnInit, OnChanges {

  collapse = true;
  private _prices: any[] = [];
  private event: any;
  private index: number;

  @Input() prices: any[] = [];
  @Output() priceFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnChanges( changes: SimpleChanges ): void {
    const currentValue = changes.prices.currentValue;
    const previousValue = changes.prices.previousValue;
    if ( currentValue.length > previousValue.length ) {
      this.event.target.checked = false;
      this.priceFilter.emit( { price_order: null } );
    }
  }

  ngOnInit(): void { }

  // Llena el la lista de tiendas
  get filterPrice() {
    let uniquePrices = [];
    uniquePrices = this.prices;
    return uniquePrices;
  }

  appliedFilter( event ) {
    this.event = event;
    this.index = this._prices.indexOf( this.event.target.value );  // checked and unchecked value
    this._prices = [];

    if ( this.event.target.checked ) {
      this._prices.push( this.event.target.value );
    } else {
      this._prices.splice( this.index, 1 );
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
