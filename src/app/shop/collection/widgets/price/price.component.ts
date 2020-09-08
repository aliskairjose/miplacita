import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Options } from 'ng5-slider';

@Component( {
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: [ './price.component.scss' ]
} )
export class PriceComponent implements OnInit {

  // Using Output EventEmitter
  @Output() priceFilter: EventEmitter<any> = new EventEmitter<any>();

  // define min, max and range
  @Input() min: number;
  @Input() max: number;

  collapse = true;
  prices = [
    { value: '1', name: 'Desde el más bajo'},
    { value: '2', name: 'Desde el más alto'}
  ];
  options: Options = {
    floor: 0,
    ceil: 1000
  };

  // price = {
  //   minPrice: this.min,
  //   maxPrice: this.max
  // };

  constructor() {
  }

  ngOnInit(): void { }

  // Range Changed
  appliedFilter( event: any ) {
    // this.price = { minPrice: event.value, maxPrice: event.highValue };
    // this.priceFilter.emit( this.price );
  }

  checked(item){
    // if(this.colors.indexOf(item) != -1){
    //   return true;
    // }
  }

}
