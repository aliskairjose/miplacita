import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Store } from '../../../shared/classes/store';

@Component( {
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: [ './coupons.component.scss' ]
} )
export class CouponsComponent implements OnInit, OnChanges {

  @Input() store: Store;

  constructor() { }


  ngOnChanges( changes: SimpleChanges ): void {
    this.store = JSON.parse( sessionStorage.getItem( 'store' ) );
    this.init();
  }


  ngOnInit(): void {
  }

  private init(): void {

  }

}
