import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Store } from '../../../../shared/classes/store';

@Component( {
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: [ './shops.component.scss' ]
} )
export class ShopsComponent implements OnInit {

  collapse = true;
  private _shops: Store[] = [];

  @Input() shops: Store[] = [];
  @Output() shopsFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  // Llena el la lista de tiendas
  get filterShop() {
    let uniqueShops = [];
    uniqueShops = this.shops;
    return uniqueShops;
  }

  appliedFilter( event ): void {
    const index = this._shops.indexOf( event.target.value );  // checked and unchecked value

    if ( event.target.checked ) {
      this._shops.push( event.target.value );
    } else {
      this._shops.splice( index, 1 );
    }

    const shops = this._shops.length ? { store: this._shops.join(',') } : { store: null };
    this.shopsFilter.emit( shops );
  }

  checked( item ) {
    if ( this._shops.indexOf( item ) !== -1 ) {
      return true;
    }
  }

}
