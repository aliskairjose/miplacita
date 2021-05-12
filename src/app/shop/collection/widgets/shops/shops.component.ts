import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '../../../../shared/classes/store';

@Component( {
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: [ './shops.component.scss' ]
} )
export class ShopsComponent implements OnInit, OnChanges {

  collapse = true;
  private _shops: Store[] = [];
  private index: number;
  private event: any;

  @Input() shops: Store[] = [];
  @Output() shopsFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }
  ngOnChanges( changes: SimpleChanges ): void {
    const currentValue = changes.shops.currentValue;
    const previousValue = changes.shops.previousValue;
    if ( ( currentValue.length > previousValue.length ) && this.index === -1 ) {
      this.event.target.checked = false;
    }
  }

  ngOnInit(): void {
  }

  // Llena el la lista de tiendas
  get filterShop() {
    let uniqueShops = [];
    uniqueShops = this.shops;
    return uniqueShops;
  }

  appliedFilter( event ): void {
    this.event = event;
    this.index = this._shops.indexOf( this.event.target.value );  // checked and unchecked value

    if ( this.event.target.checked ) {
      this._shops.push( this.event.target.value );
    } else {
      this._shops.splice( this.index, 1 );
    }

    const shops = this._shops.length ? { store: this._shops.join( ',' ) } : { store: null };
    this.shopsFilter.emit( shops );
  }

  checked( item ) {
    if ( this._shops.indexOf( item ) !== -1 ) {
      return true;
    }
  }

}
