import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Store } from '../../../../shared/classes/store';

@Component( {
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: [ './shops.component.scss' ]
} )
export class ShopsComponent implements OnInit {

  collapse = true;

  @Input() shops: Store[] = [];
  @Output() shopsFilter: EventEmitter<any> = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
  }

  appliedFilter( event ): void {
    this.shopsFilter.emit( { store: event.target.value } );
  }

  checked( item ) {
    // console.log( item );
  }

}
