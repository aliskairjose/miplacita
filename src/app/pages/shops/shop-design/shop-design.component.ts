import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbSlideEvent, NgbSlideEventSource, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
@Component( {
  selector: 'app-shop-design',
  templateUrl: './shop-design.component.html',
  styleUrls: [ './shop-design.component.scss' ]
} )
export class ShopDesignComponent implements OnInit {
  @ViewChild( 'ngcarousel', { static: true } ) ngCarousel: NgbCarousel;
  color: any;
  images = [
    { id: 0, url: '../../../assets/images/dog.png' },
    { id: 1, url: '../../../assets/images/lookbook.jpg' },
    { id: 2, url: '../../../assets/images/dog.png' }
  ];
  constructor() {

  }

  update( item ) {
    this.ngCarousel.select( item );
  }

  delete( idItem ) {
    this.images.splice( idItem, 1 );
  }
  ngOnInit(): void {
  }

}
