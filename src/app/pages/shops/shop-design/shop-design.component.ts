import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbSlideEvent, NgbSlideEventSource, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from '../../../shared/services/shop.service';
import { Store } from '../../../shared/classes/store';
import { StorageService } from '../../../shared/services/storage.service';
import { User } from '../../../shared/classes/user';
import { ToastrService } from 'ngx-toastr';
@Component( {
  selector: 'app-shop-design',
  templateUrl: './shop-design.component.html',
  styleUrls: [ './shop-design.component.scss' ]
} )
export class ShopDesignComponent implements OnInit {
  @ViewChild( 'ngcarousel', { static: true } ) ngCarousel: NgbCarousel;

  color = '';
  font = '';
  images = [
    { id: 0, url: '../../../assets/images/dog.png' },
    { id: 1, url: '../../../assets/images/lookbook.jpg' },
    { id: 2, url: '../../../assets/images/dog.png' }
  ];
  private _shop: Store = {};

  constructor(
    private storage: StorageService,
    private shopService: ShopService,
    private toastrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
    const user: User = this.storage.getItem( 'user' );
    this._shop = user.stores[ 0 ];
  }

  updateCongif(): void {
    const data = { color: this.color, font: this.font };
    this.shopService.config( this._shop._id, data ).subscribe( response => {
      if ( response.success ) {
        this.toastrService.info( response.message[ 0 ] );
      }
    } );
  }

  update( item ) {
    this.ngCarousel.select( item );
  }

  delete( idItem ) {
    this.images.splice( idItem, 1 );
  }

}
