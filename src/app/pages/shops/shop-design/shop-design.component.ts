import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
export class ShopDesignComponent implements OnInit, OnChanges {
  @ViewChild( 'ngcarousel', { static: true } ) ngCarousel: NgbCarousel;

  color = '';
  fontSelected = '';
  images = [];
  fonts = [
    { value: 'Raleway Bold', name: 'Raleway Bold' },
    { value: 'Roboto Bold', name: 'Roboto Bold' },
    { value: 'Source Sans Pro', name: 'Source Sans Pro' }
  ];

  @Input() store: Store;
  @Output() updateShop: EventEmitter<Store> = new EventEmitter<Store>();


  constructor(
    private shopService: ShopService,
    private toastrService: ToastrService,
  ) {

  }
  ngOnChanges( changes: SimpleChanges ): void {
    this.shopService.storeObserver().subscribe( ( store: Store ) => {
      this.store = store;
      this.color = this.store.config.color;
      this.fontSelected = this.store.config.font;
    } );
  }

  ngOnInit(): void {
    // const user: User = this.storage.getItem( 'user' );
    // this.store = user.stores[ 0 ];
  }

  updateConfig(): void {
    const data = { color: this.color, font: this.fontSelected };
    this.shopService.config( this.store._id, data ).subscribe( response => {
      if ( response.success ) {
        this.store = { ...response.result };
        this.toastrService.info( response.message[ 0 ] );
        this.updateShop.emit( this.store );
      }
    } );
  }

  sendImageToCloud(): void {
    this.shopService.uploadImages( { images: this.images } ).subscribe( result => {
      if ( result.status === 'isOk' ) {
        // result.images[ 0 ];
        this.shopService.addBanner( this.store._id, result.images[ 0 ] ).subscribe( _result => {
          console.log( _result );
        } );
      }
    } );
  }

  uploadImage( images: string[] ): void {
    this.images = [ ...images ];
  }

  update( item ) {
    this.ngCarousel.select( item );
  }

  delete( idItem ) {
    this.images.splice( idItem, 1 );
  }

}
