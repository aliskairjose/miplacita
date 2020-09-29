import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Store } from '../../shared/classes/store';

@Component( {
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: [ './support.component.scss' ]
} )
export class SupportComponent implements OnInit, OnChanges {

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
