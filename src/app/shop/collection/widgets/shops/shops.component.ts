import { Component, OnInit, Input } from '@angular/core';
import { Store } from '../../../../shared/classes/store';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss']
})
export class ShopsComponent implements OnInit {

  collapse = true;

  @Input() shops: Store[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  appliedFilter( event ): void {

  }

  checked( item ) {
    // if ( this.categories.indexOf( item ) !== -1 ) {
    //   return true;
    // }
  }

}
